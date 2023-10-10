package com.eventify.app.controller.api;

import jakarta.mail.MessagingException;
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
import com.eventify.app.model.json.LoginRequest;
import com.eventify.app.model.json.RegisterRequest;
import com.eventify.app.service.AuthService;
import com.eventify.app.service.EmailService;
import com.eventify.app.service.PhotoService;
import com.eventify.app.service.UserService;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@RestController
@RequiredArgsConstructor
public class AuthenticationController {

    private final UserService userService;
    private final PhotoService photoService;
    private final AuthService authService;
    private final EmailService emailService;

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
      return ResponseEntity.ok(authService.signIn(loginRequest, request, response));
    }

    // @PostMapping("/api/auth/signup")
    // public ResponseEntity<String> signUp(
    //     @RequestParam("firstName") String firstName,
    //     @RequestParam("lastName") String lastName,
    //     @RequestParam("dateOfBirth") String dateOfBirth,
    //     @RequestParam("email") String email,
    //     @RequestParam("password") String password,
    //     @RequestParam("confirmPassword") String confirmPassword,
    //     @RequestParam("photo") MultipartFile photo,
    //     @RequestParam("checkbox") boolean checkbox) throws Exception {

    //     String errorMessage = null;

    //     if (dateOfBirth.equals(",0000-00-00")) {
    //         return ResponseEntity.badRequest().body("all fields must be filled");
    //     }
    //     SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    //     Date dateOfBirthh = dateFormat.parse(dateOfBirth);
    //     User user = new User(firstName, lastName, dateOfBirthh, email, password, null);
    //     CredentialsSignup credentialsSignup = new CredentialsSignup();
    //     credentialsSignup.setFirstname(firstName);
    //     credentialsSignup.setLastname(lastName);
    //     credentialsSignup.setDob(dateOfBirthh);
    //     credentialsSignup.setEmail(email);
    //     credentialsSignup.setPassword(password);
    //     credentialsSignup.setConfirmPassword(confirmPassword);
    //     credentialsSignup.setProfilePicture(photo);
    //     if (checkbox == false) {
    //         return ResponseEntity.badRequest().body("accept terms and conditions");
    //     }
    //     if ((errorMessage = userValidator.isFormValid(credentialsSignup)) != null) {
    //         return ResponseEntity.badRequest().body(errorMessage);
    //     }
    //     try {
    //         user.setRole(Role.USER);
    //         userService.create(user);
    //     } catch (DataIntegrityViolationException e) {

    //         return ResponseEntity.badRequest().body("Email already registered");
    //     }
    //     Photo profilePicture = photoService.uploadPhoto(photo);
    //     photoService.create(profilePicture);
    //     user.setProfilePicture(profilePicture);
    //     // user.setPassword(confirmPassword);
    //     userService.update(user.getId(), user);
    //     return ResponseEntity.ok().body("Registered Succesfully");
    // }

    // @PostMapping("/api/auth/signin")
    // public ResponseEntity<AuthenticationResponse> signIn(@RequestBody CredentialsSignin credentialsSignin, HttpServletRequest request,  HttpServletResponse response) throws Exception {
    // String accessToken = null;
    //     String refreshToken = null;
    //     String csrfToken = null;
    //     String errorMessage = null;
    //     Date expirationDate = null;
    //     try {
    //         Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(credentialsSignin.email(), credentialsSignin.password()));
    //         SecurityContextHolder.getContext().setAuthentication(authentication);
    //         Optional<User> user = userService.findByEmail(credentialsSignin.email());
    //         if (user.isEmpty()) {
    //             errorMessage = "Email not registered";
    //             return ResponseEntity.ok(AuthenticationResponse.builder().error(errorMessage).accessToken(accessToken).refreshToken(refreshToken).csrfToken(csrfToken).build());
    //         }
    //         accessToken = jwtService.generateToken(user.get());
    //         refreshToken = jwtService.generateRefreshToken(user.get());
    //         user.get().setRefreshToken(refreshToken);
    //         userService.update(user.get().getId(), user.get());
    //         CsrfToken csrf = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
    //         if (csrf != null) {
    //             csrfToken = csrf.getToken();
    //         }
    //         Cookie accessTokenCookie = new Cookie("access_token", accessToken);
    //         accessTokenCookie.setHttpOnly(true);
    //         accessTokenCookie.setPath("/");
    //         // accessTokenCookie.setSecure(true); // Ensure it's sent only over HTTPS
    //         response.addCookie(accessTokenCookie);

    //         Cookie refreshTokenCookie = new Cookie("refresh_token", refreshToken);
    //         refreshTokenCookie.setHttpOnly(true);
    //         refreshTokenCookie.setPath("/");
    //         // refreshTokenCookie.setSecure(true); // Ensure it's sent only over HTTPS
    //         expirationDate = jwtService.extractExpiration(accessToken);
    //         response.addCookie(refreshTokenCookie);
    //         return ResponseEntity.ok(AuthenticationResponse.builder().error(errorMessage).accessToken(accessToken).refreshToken(refreshToken).expirationDate(expirationDate).csrfToken(csrfToken).build());
    //     } catch (BadCredentialsException e) {
    //         errorMessage = "Bad Credentials";
    //         return ResponseEntity.ok(AuthenticationResponse.builder().error(errorMessage).accessToken(accessToken).refreshToken(refreshToken).csrfToken(csrfToken).build());
    //     }
    // }

    @PostMapping("/api/authenticate")
    public ResponseEntity<String> authenticate(HttpServletRequest request) {
        return ResponseEntity.ok("daje");
    }

    @PostMapping("/api/auth/refreshToken")
    public ResponseEntity<AuthenticationResponse> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        return authService.refreshToken(request, response);
    }

    @PostMapping("/api/auth/forgot-password")
    public ResponseEntity<String> resetPasswordRequest(@RequestParam("email") String email) throws MessagingException {
        Optional<User> user = userService.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body("Email non trovata");
        }
        String resetToken = UUID.randomUUID().toString();
        userService.createResetPasswordToken(user.get(), resetToken);
        emailService.sendResetPasswordTokenEmail(user.get().getEmail(), resetToken);
        return ResponseEntity.ok("Email di ripristino password inviata con successo");
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
