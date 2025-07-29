package com.example.SecondHandMarketplace.controllers;

import com.example.SecondHandMarketplace.jwt.UserDetailsImpl;
import com.example.SecondHandMarketplace.models.Product;
import com.example.SecondHandMarketplace.models.User;
import com.example.SecondHandMarketplace.models.Wishlist;
import com.example.SecondHandMarketplace.services.UserService;
import com.example.SecondHandMarketplace.services.WishlistService;
import com.example.SecondHandMarketplace.dto.ProductDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/wishlist")
@PreAuthorize("hasRole('ROLE_BUYER')")
@CrossOrigin(origins = "http://localhost:3000")
public class WishlistController {
    @Autowired
    private WishlistService wishlistService;
    @Autowired
    private UserService userService;

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

    // Get wishlist for current buyer
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getWishlist() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Optional<User> buyer = userService.findById(userDetails.getId());
        if (buyer.isEmpty()) return ResponseEntity.badRequest().build();
        List<ProductDTO> wishlistProducts = wishlistService.getWishlistByBuyer(buyer.get())
            .stream().map(w -> toProductDTO(w.getProduct())).toList();
        return ResponseEntity.ok(wishlistProducts);
    }

    // Add product to wishlist
    @PostMapping("/add/{productId}")
    public ResponseEntity<?> addToWishlist(@PathVariable Long productId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        boolean added = wishlistService.addToWishlist(userDetails.getId(), productId);
        Optional<User> buyer = userService.findById(userDetails.getId());
        if (added && buyer.isPresent()) {
            List<ProductDTO> wishlistProducts = wishlistService.getWishlistByBuyer(buyer.get())
                .stream().map(w -> toProductDTO(w.getProduct())).toList();
            return ResponseEntity.ok(wishlistProducts);
        } else {
            return ResponseEntity.badRequest().body("Could not add product to wishlist");
        }
    }

    // Remove product from wishlist
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long productId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            boolean removed = wishlistService.removeFromWishlist(userDetails.getId(), productId);
            if (!removed) {
                System.out.println("[Wishlist] Remove failed: buyerId=" + userDetails.getId() + ", productId=" + productId);
                return ResponseEntity.status(404).body("Wishlist item not found");
            }
            Optional<User> buyer = userService.findById(userDetails.getId());
            if (buyer.isPresent()) {
                List<ProductDTO> wishlistProducts = wishlistService.getWishlistByBuyer(buyer.get())
                    .stream().map(w -> toProductDTO(w.getProduct())).toList();
                return ResponseEntity.ok(wishlistProducts);
            } else {
                // User not found, return empty list (not error)
                return ResponseEntity.ok(List.of());
            }
        } catch (Exception e) {
            // Log the error if needed
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error");
        }
    }
} 