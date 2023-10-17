package com.eventify.app.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendSignInEmail(String email, Integer otp) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true);

        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");

        String dateStr = dateFormat.format(new Date());
        String timeStr = timeFormat.format(new Date());

        messageHelper.setTo(email);
        messageHelper.setSubject("Sign In");
        messageHelper.setText("Hai effettuato un nuovo accesso il " + dateStr + " alle " + timeStr + ", se non sei tu ...... link\nInserisci il seguente codice per la verifica 2FA\n\n" + otp);
        mailSender.send(mimeMessage);
    }

    public void sendAuthFailure(String email) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true);

        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");

        String dateStr = dateFormat.format(new Date());
        String timeStr = timeFormat.format(new Date());

        messageHelper.setTo(email);
        messageHelper.setSubject("Authentication Failure");
        messageHelper.setText("Hai tentato di effettuare un nuovo accesso il " + dateStr + " alle " + timeStr + ", se non sei tu ...... link\n");
        mailSender.send(mimeMessage);
    }

    public void sendResetPassword(String email, Integer otp) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true);

        messageHelper.setTo(email);
        messageHelper.setSubject("Password Reset");
        messageHelper.setText("Hai richiesto il ripristino della password. Utilizza il seguente codice OTP per resettare la tua password: \n\n" + otp);
        mailSender.send(mimeMessage);
    }

    public void sendRefresh2fa(String email, Integer otp) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true);

        messageHelper.setTo(email);
        messageHelper.setSubject("Auth 2FA");
        messageHelper.setText("Utilizza il seguente codice OTP per resettare la tua password: \n\n" + otp);
        mailSender.send(mimeMessage);
    }
}
