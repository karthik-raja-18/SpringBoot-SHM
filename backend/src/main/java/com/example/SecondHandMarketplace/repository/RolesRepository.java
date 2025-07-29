package com.example.SecondHandMarketplace.repository;

import com.example.SecondHandMarketplace.models.Roles;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RolesRepository extends JpaRepository<Roles,Integer> {
    Optional<Roles> findByName(String name);
}
