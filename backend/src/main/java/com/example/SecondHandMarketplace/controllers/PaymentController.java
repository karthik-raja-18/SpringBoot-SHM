package com.example.SecondHandMarketplace.controllers;

import com.example.SecondHandMarketplace.models.Order;
import com.example.SecondHandMarketplace.models.Product;
import com.example.SecondHandMarketplace.models.User;
import com.example.SecondHandMarketplace.repository.ProductRepository;
import com.example.SecondHandMarketplace.repository.UserRepository;
import com.example.SecondHandMarketplace.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    /**
     * ✅ Simple endpoint to simulate payment and create orders
     */
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> request) {
        try {
            Long buyerId = ((Number) request.get("buyerId")).longValue();
            List<Map<String, Object>> cartItems = (List<Map<String, Object>>) request.get("cartItems");

            if (buyerId == null || cartItems == null || cartItems.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid buyer or empty cart"));
            }

            User buyer = userRepository.findById(buyerId)
                    .orElseThrow(() -> new RuntimeException("Buyer not found"));

            List<Order> orders = new ArrayList<>();

            for (Map<String, Object> item : cartItems) {
                Long productId = ((Number) item.get("id")).longValue();
                int quantity = ((Number) item.get("quantity")).intValue();
                double price = ((Number) item.get("price")).doubleValue();

                Product product = productRepository.findById(productId)
                        .orElseThrow(() -> new RuntimeException("Product not found"));
                User seller = product.getSeller();

                Order order = new Order(
                        buyer,
                        seller,
                        product,
                        LocalDateTime.now(),
                        quantity,
                        BigDecimal.valueOf(price),
                        buyer.getEmail(),
                        seller.getEmail()
                );

                orders.add(order);
            }

            // ✅ Save all orders
            orderService.saveOrders(orders);

            return ResponseEntity.ok(Map.of("message", "Payment successful, orders created", "orders", orders));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
