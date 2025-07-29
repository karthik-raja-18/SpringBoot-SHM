package com.example.SecondHandMarketplace.repository;

import com.example.SecondHandMarketplace.models.Product;
import com.example.SecondHandMarketplace.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByIsAvailableTrue();
    List<Product> findBySeller(User seller);
    List<Product> findByCategory(String category);
    
    @Query("SELECT p FROM Product p WHERE p.isAvailable = true AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Product> searchProducts(@Param("searchTerm") String searchTerm);
    
    List<Product> findByIsAvailableTrueOrderByCreatedAtDesc();
} 