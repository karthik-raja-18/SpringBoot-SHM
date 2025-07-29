package com.example.SecondHandMarketplace.repository;

import com.example.SecondHandMarketplace.models.Wishlist;
import com.example.SecondHandMarketplace.models.User;
import com.example.SecondHandMarketplace.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByBuyer(User buyer);
    Optional<Wishlist> findByBuyerAndProduct(User buyer, Product product);
    void deleteByBuyerAndProduct(User buyer, Product product);
} 