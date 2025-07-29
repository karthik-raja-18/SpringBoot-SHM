package com.example.SecondHandMarketplace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.SecondHandMarketplace.models.Product;
import com.example.SecondHandMarketplace.models.User;
import com.example.SecondHandMarketplace.repository.ProductRepository;
import com.example.SecondHandMarketplace.repository.UserRepository;
import java.math.BigDecimal;
import java.util.Optional;

@SpringBootApplication
public class SecondHandApplication {
    public static void main(String[] args) {
        SpringApplication.run(SecondHandApplication.class, args);
    }

    @Bean
    public CommandLineRunner loadSampleProducts(ProductRepository productRepository, UserRepository userRepository) {
        return args -> {
            // Only add if there are no products
            if (productRepository.count() == 0) {
                Optional<User> sellerOpt = userRepository.findByUsername("seller");
                if (sellerOpt.isPresent()) {
                    User seller = sellerOpt.get();
                    productRepository.save(new Product(
                        "Eco-Friendly Water Bottle",
                        "Reusable stainless steel water bottle, 750ml.",
                        new BigDecimal("12.99"),
                        "Home & Kitchen",
                        "LIKE_NEW",
                        "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
                        seller
                    ));
                    productRepository.save(new Product(
                        "Vintage Denim Jacket",
                        "Classic blue denim jacket, size M.",
                        new BigDecimal("29.99"),
                        "Clothing",
                        "GOOD",
                        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
                        seller
                    ));
                    productRepository.save(new Product(
                        "Used Textbook: Java Programming",
                        "Comprehensive Java programming textbook, 7th edition.",
                        new BigDecimal("19.99"),
                        "Books",
                        "FAIR",
                        "https://images.unsplash.com/photo-1516979187457-637abb4f9353",
                        seller
                    ));
                } else {
                    
                }
            }
        };
    }
}
