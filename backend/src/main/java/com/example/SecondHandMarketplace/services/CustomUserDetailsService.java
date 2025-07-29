package com.example.SecondHandMarketplace.services;

import com.example.SecondHandMarketplace.jwt.UserDetailsImpl;
import com.example.SecondHandMarketplace.models.User;
import com.example.SecondHandMarketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return UserDetailsImpl.build(user);
    }
}