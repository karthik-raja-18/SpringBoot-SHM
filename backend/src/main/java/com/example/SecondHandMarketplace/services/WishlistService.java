package com.example.SecondHandMarketplace.services;

import com.example.SecondHandMarketplace.models.User;
import com.example.SecondHandMarketplace.models.Product;
import com.example.SecondHandMarketplace.models.Wishlist;
import com.example.SecondHandMarketplace.repository.WishlistRepository;
import com.example.SecondHandMarketplace.repository.ProductRepository;
import com.example.SecondHandMarketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WishlistService {
    @Autowired
    private WishlistRepository wishlistRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;

    public List<Wishlist> getWishlistByBuyer(User buyer) {
        return wishlistRepository.findByBuyer(buyer);
    }

    public boolean addToWishlist(Long buyerId, Long productId) {
        Optional<User> buyerOpt = userRepository.findById(buyerId);
        Optional<Product> productOpt = productRepository.findById(productId);
        if (buyerOpt.isEmpty()) throw new RuntimeException("Buyer not found");
        if (productOpt.isEmpty()) throw new RuntimeException("Product not found");
        User buyer = buyerOpt.get();
        Product product = productOpt.get();
        if (wishlistRepository.findByBuyerAndProduct(buyer, product).isEmpty()) {
            Wishlist wishlist = new Wishlist(buyer, product);
            wishlistRepository.save(wishlist);
        }
        return true;
    }

    public boolean removeFromWishlist(Long buyerId, Long productId) {
        Optional<User> buyerOpt = userRepository.findById(buyerId);
        Optional<Product> productOpt = productRepository.findById(productId);
        if (buyerOpt.isEmpty() || productOpt.isEmpty()) {
            // Instead of throwing, just return false (item is already gone or invalid)
            return false;
        }
        User buyer = buyerOpt.get();
        Product product = productOpt.get();
        Optional<Wishlist> wishlistOpt = wishlistRepository.findByBuyerAndProduct(buyer, product);
        if (wishlistOpt.isPresent()) {
            wishlistRepository.deleteById(wishlistOpt.get().getId());
            return true;
        } else {
            return false;
        }
    }
} 