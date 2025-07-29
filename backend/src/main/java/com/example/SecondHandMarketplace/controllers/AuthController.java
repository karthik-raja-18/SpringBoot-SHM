package com.example.SecondHandMarketplace.controllers;

import com.example.SecondHandMarketplace.jwt.JwtUtils;
import com.example.SecondHandMarketplace.jwt.UserDetailsImpl;
import com.example.SecondHandMarketplace.models.User;
import com.example.SecondHandMarketplace.dto.AuthResponse;
import com.example.SecondHandMarketplace.dto.LoginRequest;
import com.example.SecondHandMarketplace.dto.RegisterRequest;
import com.example.SecondHandMarketplace.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = {"Authorization", "Content-Type", "Cache-Control", "X-Requested-With", "Accept", "Origin"})
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.registerUser(registerRequest);
            
            // Generate JWT token
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(registerRequest.getUsername(), registerRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            return ResponseEntity.ok(new AuthResponse(jwt, userDetails.getUsername(), userDetails.getName(), 
                    userDetails.getAuthorities().stream().map(auth -> auth.getAuthority()).collect(Collectors.toSet()), 
                    "User registered successfully!", userDetails.getId()));
        } catch (BadCredentialsException e) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, null, null, null, "Invalid credentials", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, null, null, null, e.getMessage(), null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            return ResponseEntity.ok(new AuthResponse(jwt, userDetails.getUsername(), userDetails.getName(), 
                    userDetails.getAuthorities().stream().map(auth -> auth.getAuthority()).collect(Collectors.toSet()), 
                    "User logged in successfully!", userDetails.getId()));
        } catch (BadCredentialsException e) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, null, null, null, "Invalid username or password", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, null, null, null, "Authentication failed", null));
        }
    }

    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        return ResponseEntity.ok("Auth controller is working!");
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            
            if (jwtUtils.validateJwtToken(token)) {
                String username = jwtUtils.getUserNameFromJwtToken(token);
                String authorities = jwtUtils.getAuthoritiesFromJwtToken(token);
                
                return ResponseEntity.ok(new AuthResponse(token, username, null, 
                        java.util.Arrays.stream(authorities.split(",")).collect(Collectors.toSet()), 
                        "Token is valid", null));
            } else {
                return ResponseEntity.badRequest().body(new AuthResponse(null, null, null, null, "Invalid token", null));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, null, null, null, "Token validation failed", null));
        }
    }
} 