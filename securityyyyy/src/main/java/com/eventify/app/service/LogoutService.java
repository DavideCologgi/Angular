// package com.eventify.app.service;

// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import lombok.RequiredArgsConstructor;
// import org.springframework.security.core.Authentication;
// // import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.web.authentication.logout.LogoutHandler;
// import org.springframework.stereotype.Service;

// import com.eventify.app.repository.ITokenRepository;

// @Service
// @RequiredArgsConstructor
// public class LogoutService implements LogoutHandler {

//   private final ITokenRepository tokenRepository;

//   @Override
//   public void logout(
//       HttpServletRequest request,
//       HttpServletResponse response,
//       Authentication authentication
//   ) {
//     final String authHeader = request.getHeader("Authorization");
//     final String jwt;
//     if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
//       return;
//     }
//     jwt = authHeader.substring(7); //estrazione token
//     var storedToken = tokenRepository.findByToken(jwt).orElse(null); //ricerca token
//     if (storedToken != null) {
//       storedToken.setExpired(true); //revoca
//       storedToken.setRevoked(true); //del
//       tokenRepository.save(storedToken);    //token
//       // SecurityContextHolder.clearContext(); //pulizia contesto di sicurezza (fatto anche in filterChain)
//     }
//   }
// }
