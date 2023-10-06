package com.eventify.app.service;

import org.apache.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.eventify.app.model.json.AuthenticationResponse;

import io.jsonwebtoken.io.IOException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class AuthService {

	private final JwtService jwtService;
	private final UserService userService;

	public ResponseEntity<AuthenticationResponse> refreshToken( HttpServletRequest request, HttpServletResponse response) throws IOException {
		String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
		String refreshToken;
		String userEmail;
		String accessToken;
		if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
        	return ResponseEntity.ok(AuthenticationResponse.builder().error("invalid Refresh-Token").refreshToken(null).accessToken(null).build());
		}
		refreshToken = authHeader.substring(7);
		userEmail = jwtService.extractUsername(refreshToken);
		if (userEmail != null) {
			var user = this.userService.findByEmail(userEmail)
					.orElseThrow();
			if (refreshToken.equals(user.refreshToken)) {
				accessToken = jwtService.generateToken(user);
				return ResponseEntity.ok(AuthenticationResponse.builder().error(null).refreshToken(null).accessToken(accessToken).build());
			}
		}
        return ResponseEntity.ok(AuthenticationResponse.builder().error("invalid Refresh-token").refreshToken(null).accessToken(null).build());
	}
}
