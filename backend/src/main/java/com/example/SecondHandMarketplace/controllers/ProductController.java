package com.example.SecondHandMarketplace.controllers;

import com.example.SecondHandMarketplace.jwt.UserDetailsImpl;
import com.example.SecondHandMarketplace.models.Product;
import com.example.SecondHandMarketplace.models.User;
import com.example.SecondHandMarketplace.repository.ProductRepository;
import com.example.SecondHandMarketplace.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.example.SecondHandMarketplace.dto.ProductDTO;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080"}, allowCredentials = "true")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserService userService;

    // DTO class for exposing limited product data

    // Get all available products (public)
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<Product> products = productRepository.findByIsAvailableTrueOrderByCreatedAtDesc();
        List<ProductDTO> dtoList = products.stream().map(product -> {
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
        }).toList();
        return ResponseEntity.ok(dtoList);
    }

    // Get product by ID (public)
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent() && product.get().isAvailable()) {
            Product p = product.get();
            ProductDTO dto = new ProductDTO();
            dto.setId(p.getId());
            dto.setTitle(p.getTitle());
            dto.setDescription(p.getDescription());
            dto.setPrice(p.getPrice());
            dto.setCategory(p.getCategory());
            dto.setCondition(p.getCondition());
            dto.setImageUrl(p.getImageUrl());
            dto.setCreatedAt(p.getCreatedAt());
            dto.setAvailable(p.isAvailable());
            if (p.getSeller() != null) {
                dto.setSellerId(p.getSeller().getId());
                dto.setSellerName(p.getSeller().getName());
            }
            return ResponseEntity.ok(dto);
        }
        return ResponseEntity.notFound().build();
    }

    // Search products (public)
    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchProducts(@RequestParam String query) {
        List<Product> products = productRepository.searchProducts(query);
        List<ProductDTO> dtoList = products.stream().map(product -> {
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
        }).toList();
        return ResponseEntity.ok(dtoList);
    }

    // Get products by category (public)
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductDTO>> getProductsByCategory(@PathVariable String category) {
        List<Product> products = productRepository.findByCategory(category);
        List<ProductDTO> dtoList = products.stream().map(product -> {
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
        }).toList();
        return ResponseEntity.ok(dtoList);
    }

    // Create new product (SELLER only)
    @PostMapping
    @PreAuthorize("hasRole('ROLE_SELLER')")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Optional<User> seller = userService.findById(userDetails.getId());
        if (seller.isPresent()) {
            product.setSeller(seller.get());
            Product savedProduct = productRepository.save(product);
            return ResponseEntity.ok(savedProduct);
        }
        return ResponseEntity.badRequest().build();
    }

    // Update product (SELLER only, own products)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_SELLER')")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent() && product.get().getSeller().getId().equals(userDetails.getId())) {
            Product existingProduct = product.get();
            existingProduct.setTitle(productDetails.getTitle());
            existingProduct.setDescription(productDetails.getDescription());
            existingProduct.setPrice(productDetails.getPrice());
            existingProduct.setCategory(productDetails.getCategory());
            existingProduct.setCondition(productDetails.getCondition());
            existingProduct.setImageUrl(productDetails.getImageUrl());
            existingProduct.setAvailable(productDetails.isAvailable());

            Product updatedProduct = productRepository.save(existingProduct);

            // Map to DTO
            ProductDTO dto = new ProductDTO();
            dto.setId(updatedProduct.getId());
            dto.setTitle(updatedProduct.getTitle());
            dto.setDescription(updatedProduct.getDescription());
            dto.setPrice(updatedProduct.getPrice());
            dto.setCategory(updatedProduct.getCategory());
            dto.setCondition(updatedProduct.getCondition());
            dto.setImageUrl(updatedProduct.getImageUrl());
            dto.setCreatedAt(updatedProduct.getCreatedAt());
            dto.setAvailable(updatedProduct.isAvailable());
            if (updatedProduct.getSeller() != null) {
                dto.setSellerId(updatedProduct.getSeller().getId());
                dto.setSellerName(updatedProduct.getSeller().getName());
            }
            return ResponseEntity.ok(dto);
        }
        return ResponseEntity.notFound().build();
    }

    // Delete product (SELLER only, own products)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_SELLER')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent() && product.get().getSeller().getId().equals(userDetails.getId())) {
            productRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Get products posted by authenticated seller
    @GetMapping("/my-products")
    @PreAuthorize("hasRole('ROLE_SELLER')")
    public ResponseEntity<List<ProductDTO>> getMyProducts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Optional<User> seller = userService.findById(userDetails.getId());
        if (seller.isPresent()) {
            List<Product> products = productRepository.findBySeller(seller.get());
            List<ProductDTO> dtoList = products.stream().map(product -> {
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
            }).toList();
            return ResponseEntity.ok(dtoList);
        }
        return ResponseEntity.badRequest().build();
    }
}
