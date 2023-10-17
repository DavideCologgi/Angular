// package com.eventify.app.config;

// import org.springframework.stereotype.Component;
// import org.springframework.web.filter.OncePerRequestFilter;
// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import java.io.IOException;
// import org.apache.commons.io.IOUtils;
// import java.nio.charset.StandardCharsets;
// import java.util.regex.Pattern;
// import java.util.regex.Matcher;

// @Component
// public class SqlInjectionFilter extends OncePerRequestFilter {

//     private static final Pattern SQL_INJECTION_PATTERN = Pattern.compile(
//         ".*[;]+.*|.*(--)+.*|.*\\b(ALTER|CREATE|DELETE|DROP|EXEC|INSERT|MERGE|SELECT|UPDATE)\\b.*",
//         Pattern.CASE_INSENSITIVE);

//     @Override
//     protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

//         String requestBody = IOUtils.toString(request.getInputStream(), StandardCharsets.UTF_8);

//         if (containsSqlInjectionCharacters(requestBody)) {
//             response.setStatus(HttpServletResponse.SC_FORBIDDEN);
//             return;
//         }
//         filterChain.doFilter(request, response);
//     }

//     private boolean containsSqlInjectionCharacters(String requestBody) {
//         Matcher matcher = SQL_INJECTION_PATTERN.matcher(requestBody);
//         return matcher.matches();
//     }
// }
