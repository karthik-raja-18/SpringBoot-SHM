package com.example.SecondHandMarketplace.config;

import com.example.SecondHandMarketplace.models.Roles;
import com.example.SecondHandMarketplace.repository.RolesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private RolesRepository rolesRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize roles if they don't exist
        if (rolesRepository.findByName("ROLE_BUYER").isEmpty()) {
            Roles buyerRole = new Roles();
            buyerRole.setName("ROLE_BUYER");
            rolesRepository.save(buyerRole);
            System.out.println("Created ROLE_BUYER");
        }

        if (rolesRepository.findByName("ROLE_SELLER").isEmpty()) {
            Roles sellerRole = new Roles();
            sellerRole.setName("ROLE_SELLER");
            rolesRepository.save(sellerRole);
            System.out.println("Created ROLE_SELLER");
        }
    }
}
