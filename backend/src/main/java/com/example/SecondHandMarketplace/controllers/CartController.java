package com.example.SecondHandMarketplace.controllers;

import com.example.SecondHandMarketplace.dto.ProductDTO;
import com.example.SecondHandMarketplace.jwt.UserDetailsImpl;
import com.example.SecondHandMarketplace.models.Product;
import com.example.SecondHandMarketplace.models.User;
import com.example.SecondHandMarketplace.repository.ProductRepository;
import com.example.SecondHandMarketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart")
@PreAuthorize("hasRole('ROLE_BUYER')")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CartController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl)) {
            return null;
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userRepository.findById(userDetails.getId()).orElse(null);
    }

    private ProductDTO toProductDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setTitle(product.getTitle());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setCategory(product.getCategory());
        dto.setCondition(product.getCondition());
        dto.setImageUrl(product.getImageUrl());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setAvailable(product.isAvailable());
        if (product.getSeller() != null) {
            dto.setSellerId(product.getSeller().getId());
            dto.setSellerName(product.getSeller().getName());
        }
        return dto;
    }

    /**
     * Returns the cart as a list of ProductDTOs.
     */
    @GetMapping
    public ResponseEntity<?> getCart() {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).body("Unauthorized: User not found");

        user.ensureCartInitialized();

        return ResponseEntity.ok(user.getCartAsList().stream()
                .map(this::toProductDTO)
                .collect(Collectors.toList()));
    }

    /**
     * Adds a product to the buyer's cart.
     */
    @PostMapping("/add/{productId}")
    public ResponseEntity<?> addToCart(@PathVariable Long productId) {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).body("Unauthorized: User not found");

        user.ensureCartInitialized();

        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Product not found");
        }

        List<Product> cartList = user.getCartAsList();

        // Enforce max 10 items
        if (cartList.size() >= 10) {
            Product oldest = cartList.get(0);
            user.getCart().remove(oldest);
        }

        Product product = productOpt.get();
        user.getCart().add(product);
        userRepository.save(user);

        return ResponseEntity.ok(cartList.stream().map(this::toProductDTO).collect(Collectors.toList()));
    }

    /**
     * Removes a product from the buyer's cart.
     */
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long productId) {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).body("Unauthorized: User not found");

        user.ensureCartInitialized();
        user.getCart().removeIf(p -> p.getId().equals(productId));
        userRepository.save(user);

        return ResponseEntity.ok(user.getCartAsList().stream()
                .map(this::toProductDTO)
                .collect(Collectors.toList()));
    }

    /**
     * Clears the entire cart.
     */
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart() {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).body("Unauthorized: User not found");

        user.ensureCartInitialized();
        user.getCart().clear();
        userRepository.save(user);

        return ResponseEntity.ok(Collections.emptyList());
    }
}
