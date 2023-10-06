package com.eventify.app.controller.api;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.eventify.app.model.Photo;
import com.eventify.app.model.User;
import com.eventify.app.model.enums.Role;
import com.eventify.app.model.json.AuthenticationResponse;
import com.eventify.app.model.json.CredentialsSignin;
import com.eventify.app.model.json.CredentialsSignup;
import com.eventify.app.service.AuthService;
import com.eventify.app.service.EmailService;
import com.eventify.app.service.JwtService;
import com.eventify.app.service.PhotoService;
import com.eventify.app.service.UserService;
import com.eventify.app.validator.UserValidator;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.validation.Errors;

@RestController
@AllArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserValidator userValidator;
    private final PhotoService photoService;
    private final JwtService jwtService;
    private final AuthService authService;
    private final EmailService emailService;
    private final AuthenticationManager authManager;

    @PostMapping("/api/auth/signup")
    public ResponseEntity<String> signUp(
        @RequestParam("firstName") String firstName,
        @RequestParam("lastName") String lastName,
        @RequestParam("dateOfBirth") String dateOfBirth,
        @RequestParam("email") String email,
        @RequestParam("password") String password,
        @RequestParam("confirmPassword") String confirmPassword,
        @RequestParam("photo") MultipartFile photo,
        @RequestParam("checkbox") boolean checkbox) throws Exception {

        String errorMessage = null;

        if (dateOfBirth.equals(",0000-00-00")) {
            return ResponseEntity.badRequest().body("all fields must be filled");
        }
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date dateOfBirthh = dateFormat.parse(dateOfBirth);
        User user = new User(firstName, lastName, dateOfBirthh, email, password, null);
        CredentialsSignup credentialsSignup = new CredentialsSignup();
        credentialsSignup.setFirstname(firstName);
        credentialsSignup.setLastname(lastName);
        credentialsSignup.setDob(dateOfBirthh);
        credentialsSignup.setEmail(email);
        credentialsSignup.setPassword(password);
        credentialsSignup.setConfirmPassword(confirmPassword);
        credentialsSignup.setProfilePicture(photo);
        if (checkbox == false) {
            return ResponseEntity.badRequest().body("accept terms and conditions");
        }
        if ((errorMessage = userValidator.isFormValid(credentialsSignup)) != null) {
            return ResponseEntity.badRequest().body(errorMessage);
        }
        try {
            user.setRole(Role.USER);
            userService.create(user);
        } catch (DataIntegrityViolationException e) {

            return ResponseEntity.badRequest().body("Email already registered");
        }
        Photo profilePicture = photoService.uploadPhoto(photo);
        photoService.create(profilePicture);
        user.setProfilePicture(profilePicture);
        userService.update(user.getId(), user);
        return ResponseEntity.ok().body("Registered Succesfully");
    }

    @PostMapping("/api/auth/signin")
    public ResponseEntity<AuthenticationResponse> signUp(@RequestBody CredentialsSignin credentialsSignin, HttpServletRequest request) throws Exception {
        String accessToken = null;
        String refreshToken = null;
        String csrfToken = null;
        String errorMessage = null;
        try {
            Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(credentialsSignin.email(), credentialsSignin.password()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            Optional<User> user = userService.findByEmail(credentialsSignin.email());
            if (user.isEmpty()) {
                errorMessage = "Email not registered";
                return ResponseEntity.ok(AuthenticationResponse.builder().error(errorMessage).accessToken(accessToken).refreshToken(refreshToken).csrfToken(csrfToken).build());
            }
            accessToken = jwtService.generateToken(user.get());
            CsrfToken csrf = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
            if (csrf != null) {
                csrfToken = csrf.getToken();
            }
            return ResponseEntity.ok(AuthenticationResponse.builder().error(errorMessage).accessToken(accessToken).refreshToken(refreshToken).csrfToken(csrfToken).build());
        } catch (BadCredentialsException e) {
            errorMessage = "Bad Credentials";
            return ResponseEntity.ok(AuthenticationResponse.builder().error(errorMessage).accessToken(accessToken).refreshToken(refreshToken).csrfToken(csrfToken).build());
        }
    }

    @PostMapping("/api/auth/refresh-token")
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
