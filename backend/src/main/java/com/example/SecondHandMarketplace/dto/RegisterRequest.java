package com.example.SecondHandMarketplace.dto;

import java.util.List;

public class RegisterRequest {
    private String name;
    private String username;
    private String email;
    private String password;
    private String phone;
    private String address;
    private List<String> roles; // e.g. ["ROLE_BUYER", "ROLE_SELLER"]

    public RegisterRequest() {
    }

    public RegisterRequest(String name, String username, String email, String password, String phone, String address, List<String> roles) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.address = address;
        this.roles = roles;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
} 