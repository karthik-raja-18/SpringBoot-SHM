package com.example.SecondHandMarketplace.dto;

import java.util.Set;

public class AuthResponse {
    private String token;
    private String username;
    private String name;
    private Set<String> roles;
    private String message;
    private Long userId;

    public AuthResponse() {
    }

    public AuthResponse(String token, String username, String name, Set<String> roles, String message, Long userId) {
        this.token = token;
        this.username = username;
        this.name = name;
        this.roles = roles;
        this.message = message;
        this.userId = userId;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
} 