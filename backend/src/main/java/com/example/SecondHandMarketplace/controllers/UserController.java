package com.example.SecondHandMarketplace.controllers;

import com.example.SecondHandMarketplace.models.User;
import com.example.SecondHandMarketplace.services.UserService;
import com.example.SecondHandMarketplace.jwt.UserDetailsImpl;
import com.example.SecondHandMarketplace.dto.UserProfileDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/user")
@PreAuthorize("hasAnyRole('ROLE_BUYER', 'ROLE_SELLER')")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    // Get current user's profile
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl)) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Optional<User> userOpt = userService.findById(userDetails.getId());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            UserProfileDTO dto = new UserProfileDTO();
            dto.setId(user.getId());
            dto.setName(user.getName());
            dto.setUsername(user.getUsername());
            dto.setEmail(user.getEmail());
            dto.setPhone(user.getPhone());
            dto.setAddress(user.getAddress());
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }

    // Update current user's profile
    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUserProfile(@RequestBody User updatedUser) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl)) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Optional<User> userOpt = userService.findById(userDetails.getId());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setName(updatedUser.getName());
            user.setEmail(updatedUser.getEmail());
            user.setPhone(updatedUser.getPhone());
            user.setAddress(updatedUser.getAddress());
            // Do not update username, password, or roles here
            User saved = userService.save(user);
            UserProfileDTO dto = new UserProfileDTO();
            dto.setId(saved.getId());
            dto.setName(saved.getName());
            dto.setUsername(saved.getUsername());
            dto.setEmail(saved.getEmail());
            dto.setPhone(saved.getPhone());
            dto.setAddress(saved.getAddress());
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }

    // Get user's public contact information by ID
    @GetMapping("/{userId}/contact")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUserContactInfo(@PathVariable Long userId) {
        Optional<User> userOpt = userService.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Create a DTO with only the contact information we want to expose
            Map<String, String> contactInfo = new HashMap<>();
            contactInfo.put("id", user.getId().toString());
            contactInfo.put("name", user.getName());
            contactInfo.put("email", user.getEmail());
            contactInfo.put("phone", user.getPhone());
            contactInfo.put("address", user.getAddress());
            return ResponseEntity.ok(contactInfo);
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }
}