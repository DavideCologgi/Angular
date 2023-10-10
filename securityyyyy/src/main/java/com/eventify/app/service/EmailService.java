package com.eventify.app.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender emailSender;

    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    public void sendResetPasswordTokenEmail(String email, String resetToken) throws MessagingException {
        MimeMessage mimeMessage = emailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true);
        messageHelper.setTo(email);
        messageHelper.setSubject("Password Reset");
        messageHelper.setText("Hai richiesto il ripristino della password. Utilizza il seguente token per resettare la tua password: \n\n" + resetToken);
        emailSender.send(mimeMessage);
    }
}
