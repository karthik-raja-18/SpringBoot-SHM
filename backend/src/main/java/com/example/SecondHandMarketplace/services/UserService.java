package com.example.SecondHandMarketplace.services;

import com.example.SecondHandMarketplace.models.Roles;
import com.example.SecondHandMarketplace.models.User;
import com.example.SecondHandMarketplace.dto.RegisterRequest;
import com.example.SecondHandMarketplace.repository.RolesRepository;
import com.example.SecondHandMarketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RolesRepository rolesRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(RegisterRequest registerRequest) {
        // Check if username or email already exists
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        // Create new user
        User user = new User();
        user.setName(registerRequest.getName());
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setPhone(registerRequest.getPhone());
        user.setAddress(registerRequest.getAddress());

        // Set roles based on request - ensure only one role per user
        Set<Roles> roles = new HashSet<>();
        if (registerRequest.getRoles() != null && !registerRequest.getRoles().isEmpty()) {
            // Take only the first role to ensure one role per user
            String roleName = registerRequest.getRoles().get(0);
            Optional<Roles> role = rolesRepository.findByName(roleName);
            if (role.isPresent()) {
                roles.add(role.get());
            } else {
                throw new RuntimeException("Role not found: " + roleName);
            }
        } else {
            throw new RuntimeException("No roles provided");
        }
        
        user.setRoles(roles);

        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public User save(User user) {
        return userRepository.save(user);
    }
} 