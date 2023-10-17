package com.eventify.app.controller.api;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.eventify.app.model.Photo;
import com.eventify.app.model.User;
import com.eventify.app.model.json.AuthenticationResponse;
import com.eventify.app.model.json.EmailOtp;
import com.eventify.app.model.json.LoginRequest;
import com.eventify.app.model.json.Otp2FA;
import com.eventify.app.model.json.RegisterRequest;
import com.eventify.app.model.json.ResetPasswordRequest;
import com.eventify.app.service.AuthService;
import com.eventify.app.service.EmailService;
import com.eventify.app.service.JwtService;
import com.eventify.app.service.PhotoService;
import com.eventify.app.service.UserService;
import com.eventify.app.validator.UserValidator;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@RestController
@RequiredArgsConstructor
public class AuthenticationController {  //GENERALIZZARE ERRORI, CONSIGLIO  OWASP per non dare info agli hacker

    // gestire deserializzazione per prevenire  attacchi DDoS
    // capire bene meta-inf se sono gia utilizzabili o da implementare
    // cercare patch disponibili e vulnerabilita per le dipendenze utilizzate, usare sempre le ultime versioni
    private final UserService userService;
    private final PhotoService photoService;
    private final AuthService authService;
    private final UserValidator userValidator;
    private final EmailService emailService;
    private final JwtService jwtService;

    @PostMapping("api/auth/signup")
    public ResponseEntity<String> signup(@RequestParam("firstName") String firstName,
          @RequestParam("lastName") String lastName,
          @RequestParam("dateOfBirth") String dateOfBirth,
          @RequestParam("email") String email,
          @RequestParam("password") String password,
          @RequestParam("confirmPassword") String confirmPassword,
          @RequestParam("photo") MultipartFile photo,
          @RequestParam("checkbox") boolean checkbox) throws Exception {

          if (dateOfBirth.equals(",0000-00-00")) {
              return ResponseEntity.ok("all fields must be filled");
          }
          SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
          Date dateOfBirthh = dateFormat.parse(dateOfBirth);
          RegisterRequest registerRequest = new RegisterRequest();
          registerRequest.setFirstname(firstName);
          registerRequest.setLastname(lastName);
          registerRequest.setDob(dateOfBirthh);
          registerRequest.setEmail(email);
          registerRequest.setPassword(password);
          registerRequest.setConfirmPassword(confirmPassword);
          registerRequest.setProfilePicture(photo);
          registerRequest.setCheckbox(checkbox);
      return ResponseEntity.ok(authService.signUp(registerRequest));
    }

    @PostMapping("api/auth/signin")
    public ResponseEntity<AuthenticationResponse> signIn(@RequestBody LoginRequest loginRequest, HttpServletRequest request, HttpServletResponse response) throws Exception {
      System.out.println("\n\n\n\n\n\n email : " + loginRequest.getEmail() + "\n password : " + loginRequest.getPassword() + "\n\n\n\n\n");
      return ResponseEntity.ok(authService.signIn(loginRequest, request, response));
    }


    @PostMapping("/api/authenticate")
    public ResponseEntity<String> authenticate(HttpServletRequest request) {
        return ResponseEntity.ok("daje");
    }


    @PostMapping("/api/auth/2FA")
    public ResponseEntity<AuthenticationResponse> auth2fa(@RequestBody Otp2FA otp2FA, HttpServletResponse response) {
        try {
            Integer otp = Integer.parseInt(otp2FA.otp());
            System.out.println(otp.intValue());
            Optional<User> user = userService.findByOtp(otp);
            if (user.isEmpty()) {
                return ResponseEntity.ok(AuthenticationResponse.builder().error("codice otp errato").accessToken(null).refreshToken(null).expirationDate(null).build());
            }
            user.get().setOtp(null);
            String accessToken = jwtService.generateToken(user.get());
            String refreshToken = jwtService.generateRefreshToken(user.get());
            user.get().setRefreshToken(refreshToken);
            userService.update(user.get().getId(), user.get());
            Cookie accessTokenCookie = new Cookie("access_token", accessToken);
            accessTokenCookie.setHttpOnly(true);
            accessTokenCookie.setPath("/");
            accessTokenCookie.setAttribute("SameSite", "Strict");
            accessTokenCookie.setSecure(true);
            response.addCookie(accessTokenCookie);

            Cookie refreshTokenCookie = new Cookie("refresh_token", refreshToken);
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setPath("/");
            refreshTokenCookie.setAttribute("SameSite", "Strict");
            refreshTokenCookie.setSecure(true);
            Date expirationDate = jwtService.extractExpiration(accessToken);
            response.addCookie(refreshTokenCookie);
            return ResponseEntity.ok(AuthenticationResponse.builder().error(null).accessToken(accessToken).refreshToken(refreshToken).expirationDate(expirationDate).build());

        } catch (NumberFormatException e) {
            System.err.println("Failed to convert the string to an integer: " + e.getMessage());
            return ResponseEntity.ok(AuthenticationResponse.builder().error("codice otp errato").accessToken(null).refreshToken(null).expirationDate(null).build());
        }
    }

    @PostMapping("/api/auth/refresh-2FA")
    public void refreshauth2fa(@RequestBody EmailOtp emailRefreshOtp) {
        try {
            String secretKey = authService.generateSecretKey();
            int otp = authService.generateOtp(secretKey);

            Optional<User> user = userService.findByEmail(emailRefreshOtp.email());
            user.get().setOtp(otp);
            userService.update(user.get().getId(), user.get());

            emailService.sendRefresh2fa(emailRefreshOtp.email(), otp);
        } catch (MessagingException e) { }
    }

    @PostMapping("/api/auth/signin-failure")
    public void auth2faFailure(@RequestParam("email") String email) {
        try {
            emailService.sendAuthFailure(email);
        } catch (MessagingException e) { }
    }

    @PostMapping("/api/auth/forgot-password")
    public ResponseEntity<String> resetPasswordRequest(@RequestBody EmailOtp emailForgotPassword) throws MessagingException {
        Optional<User> user = userService.findByEmail(emailForgotPassword.email());
        if (user.isEmpty()) {
            return ResponseEntity.ok("Email non trovata");
        }
        String secretKey = authService.generateSecretKey();
        int otp = authService.generateOtp(secretKey);

        user.get().setOtp(otp);
        userService.update(user.get().getId(), user.get());
        emailService.sendResetPassword(user.get().getEmail(), otp);
        return ResponseEntity.ok(emailForgotPassword.email());
    }

    @PostMapping("/api/auth/reset-password")
    public ResponseEntity<String> resetPasswordRequestValidation(@RequestBody ResetPasswordRequest resetPasswordRequest) throws MessagingException {
        String password = resetPasswordRequest.password();
        String confirmPassword = resetPasswordRequest.confirmPassword();
        try {
            Integer otp = Integer.parseInt(resetPasswordRequest.otp());
            Optional<User> user = userService.findByOtp(otp);
            if (user.isEmpty())
                return ResponseEntity.ok("codice otp errato");
                //redirect a /api/auth/reset-password  generare nuovo token
            if (password.equals(confirmPassword) && password.length() >= 8 && userValidator.isStrongPassword(password)) {
                BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder();
                String EncryptedPwd = bcrypt.encode(password);
                user.get().setPassword(EncryptedPwd);
                user.get().setOtp(null);
                userService.update(user.get().getId(), user.get());
            } else {
                return ResponseEntity.ok("password must be qual to confirm password and they  must contain at least 8 character, 1 uppercase, 1 special character and 1 digit");
            }
            return ResponseEntity.ok("Ripristino password effettuato con successo"); //reindirizzare al login
        } catch (NumberFormatException e) {
            System.err.println("Failed to convert the string to an integer: " + e.getMessage());
            return ResponseEntity.ok("codice otp errato");
        }

    }

    @PostMapping("/api/auth/refreshToken")
    public ResponseEntity<AuthenticationResponse> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        return authService.refreshToken(request, response);
    }

    @GetMapping("/api/download/{id}")
    public ResponseEntity<Resource> DownloadImage(@PathVariable Long id) throws Exception {

        Photo photo = photoService.getById(id).get();
        return ResponseEntity.created(null)
        .contentType(MediaType.parseMediaType(photo.getPhotoType()))
        .header(HttpHeaders.CONTENT_DISPOSITION,
                "photo; filename=\"" + photo.getPhotoName()
                + "\"").body(new ByteArrayResource(photo.getData()));
    }
}
