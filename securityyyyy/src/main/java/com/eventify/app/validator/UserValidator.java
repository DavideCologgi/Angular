package com.eventify.app.validator;

import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.Date;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.util.IOUtils;
import com.eventify.app.model.User;
import com.eventify.app.model.json.CredentialsSignup;

@Component
// public class UserValidator implements Validator {
public class UserValidator {

    private static final String NAME_REGEX = "^[A-Za-z]+$";
    private static final String PASSWORD_REGEX = "^(?=.*[0-9])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$";
    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+)\\.[A-Za-z]{2,4}$";
    private static final byte[][] SUPPORTED_IMAGE_MAGIC_NUMBERS = {
        {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0},
        {(byte) 0x89, (byte) 0x50, (byte) 0x4E, (byte) 0x47}
    };

    // @Override
    // public boolean supports(Class<?> clazz) {
    //     return User.class.equals(clazz);
    // }

    public String isFormValid(CredentialsSignup credentialsSignup) {
        if (credentialsSignup.getFirstname() == null || credentialsSignup.getFirstname().isEmpty() ||
            credentialsSignup.getLastname() == null || credentialsSignup.getLastname().isEmpty() ||
            credentialsSignup.getEmail() == null || credentialsSignup.getEmail().isEmpty() ||
            credentialsSignup.getPassword() == null || credentialsSignup.getPassword().isEmpty() ||
            credentialsSignup.getDob() == null || credentialsSignup.getProfilePicture() == null ||
            credentialsSignup.getConfirmPassword() == null || credentialsSignup.getConfirmPassword().isEmpty()) {
            return "All fields must be filled";
        }
        Date dobDate = credentialsSignup.getDob();
        LocalDate dob = dobDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate today = LocalDate.now();
        Period age = Period.between(dob, today);
        if (!isValidName(credentialsSignup.getFirstname()) || !isValidName(credentialsSignup.getLastname())) {
            return "Firstname and lastname must contain only alphabetic characters";
        }
        if (!isImageFile(credentialsSignup.getProfilePicture())) {
            return "Invalid image file format. Only image files are allowed.";
        }
        if (!isValidEmail(credentialsSignup.getEmail())) {
            return "Invalid email address";
        }
        if (age.getYears() < 18) {
            return "you must have at least 18 years old";
        }
        if (!credentialsSignup.getPassword().equals(credentialsSignup.getConfirmPassword())) {
            return "Password are not equals";
        }
        if (credentialsSignup.getPassword().length() < 8)  {
            return "Password is less than 8 characters";
        }
        if (!isStrongPassword(credentialsSignup.getPassword())) {
            return "Password must contain at least : an uppercase char, a special character and a number";
        }
		return null;
	}

    public String isFormValid(User user, MultipartFile imageFile, String confirmPassword) {
        if (user.getFirstname() == null || user.getFirstname().isEmpty() ||
            user.getLastname() == null || user.getLastname().isEmpty() ||
            user.getEmail() == null || user.getEmail().isEmpty() ||
            user.getPassword() == null || user.getPassword().isEmpty() ||
            user.getDob() == null || imageFile == null || confirmPassword == null) {
            return "All fields must be filled";
        }
        Date dobDate = user.getDob();
        LocalDate dob = dobDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate today = LocalDate.now();
        Period age = Period.between(dob, today);
        if (!isValidName(user.getFirstname()) || !isValidName(user.getLastname())) {
            return "Firstname and lastname must contain only alphabetic characters";
        }
        if (!isImageFile(imageFile)) {
            return "Invalid image file format. Only image files are allowed.";
        }
        if (!isValidEmail(user.getEmail())) {
            return "Invalid email address";
        }
        if (age.getYears() < 18) {
            return "you must have at least 18 years old";
        }
        if (!user.getPassword().equals(confirmPassword)) {
            return "Password are not equals";
        }
        if (user.getPassword().length() < 8)  {
            return "Password is less than 8 characters";
        }
        if (!isStrongPassword(user.getPassword())) {
            return "Password must contain at least : an uppercase char, a special character and a number";
        }
		return null;
	}

    // @Override
    // public void validate(Object target, Errors errors) {
    //     CredentialsSignup user = (CredentialsSignup) target;

    //     ValidationUtils.rejectIfEmptyOrWhitespace(errors, "firstname", "field.required", "First Name is required.");
    //     ValidationUtils.rejectIfEmptyOrWhitespace(errors, "lastname", "field.required", "Last Name is required.");
    //     ValidationUtils.rejectIfEmptyOrWhitespace(errors, "dob", "field.required", "Date of Birth is required.");
    //     ValidationUtils.rejectIfEmptyOrWhitespace(errors, "email", "field.required", "Email is required.");
    //     ValidationUtils.rejectIfEmptyOrWhitespace(errors, "password", "field.required", "Password is required.");
    //     ValidationUtils.rejectIfEmptyOrWhitespace(errors, "confirmPassword", "field.required", "Confirm Password is required.");

    //     if (!isValidName(user.getFirstname()) || !isValidName(user.getLastname())) {
    //         errors.reject("invalid.characters", "Firstname and lastname must contain only alphabetic characters");
    //     }

    //     if (user.getDob() == null) {
    //         errors.reject("field.required", "All fields must be filled");
    //     }

    //     String dobString = user.getDob();
    //     LocalDate dob = LocalDate.parse(dobString);
    //     LocalDate today = LocalDate.now();
    //     Period age = Period.between(dob, today);

    //     if (age.getYears() < 18) {
    //         errors.reject("age.invalid", "You must be at least 18 years old");
    //     }

    //     if (!isValidEmail(user.getEmail())) {
    //         errors.reject("invalid.email", "Invalid email address");
    //     }

    //     if (user.getPassword().length() < 8) {
    //         errors.reject("password.short", "Password is less than 8 characters");
    //     }

    //     if (!isStrongPassword(user.getPassword())) {
    //         errors.reject("password.weak", "Password must contain at least an uppercase character, a special character, and a number");
    //     }

    //     if (!user.getPassword().equals(user.getConfirmPassword())) {
    //         errors.rejectValue("confirmPassword", "field.mismatch", "Passwords do not match.");
    //     }

    //     if (user.getProfilePicture() == null || user.getProfilePicture().isEmpty()) {
    //         errors.rejectValue("profilePicture", "field.required", "Profile Picture is required.");
    //     }

    //     if (user.getDob() == null) {
    //         errors.reject("field.required", "All fields must be filled");
    //     }

    //     if (!isValidEmail(user.getEmail())) {
    //         errors.reject("invalid.email", "Invalid email address");
    //     }

    //     if (age.getYears() < 18) {
    //         errors.reject("age.invalid", "You must be at least 18 years old");
    //     }

    //     if (user.getPassword().length() < 8) {
    //         errors.reject("password.short", "Password is less than 8 characters");
    //     }

    //     if (!isStrongPassword(user.getPassword())) {
    //         errors.reject("password.weak", "Password must contain at least an uppercase character, a special character, and a number");
    //     }

    //     if (user.getProfilePicture() == null || user.getProfilePicture().isEmpty()) {
    //         errors.rejectValue("profilePicture", "field.required", "Profile Picture is required.");
    //     }

    //     MultipartFile profilePicture = user.getProfilePicture();

    //     if (profilePicture == null) {
    //         errors.reject("field.required", "All fields must be filled");
    //     }

    //     if (!isImageFile(profilePicture)) {
    //         errors.reject("invalid.image", "Invalid image file format. Only image files are allowed.");
    //     }
    // }


    public boolean isValidName(String name) {
        return name.matches(NAME_REGEX);
    }

    public boolean isStrongPassword(String password) {
        return password.matches(PASSWORD_REGEX);
    }

    public boolean isValidEmail(String email) {
        return email.matches(EMAIL_REGEX);
    }

    public boolean isImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }
        try {
            byte[] fileBytes = IOUtils.toByteArray(file.getInputStream());
            for (byte[] magicNumber : SUPPORTED_IMAGE_MAGIC_NUMBERS) {
                if (startsWith(fileBytes, magicNumber)) {
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private boolean startsWith(byte[] array, byte[] prefix) {
        if (array.length < prefix.length) {
            return false;
        }
        for (int i = 0; i < prefix.length; i++) {
            if (array[i] != prefix[i]) {
                return false;
            }
        }
        return true;
    }
}
