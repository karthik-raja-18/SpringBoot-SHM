package com.example.SecondHandMarketplace.controllers;

import com.example.SecondHandMarketplace.dto.OrderDTO;
import com.example.SecondHandMarketplace.models.*;
import com.example.SecondHandMarketplace.repository.OrderRepository;
import com.example.SecondHandMarketplace.repository.ProductRepository;
import com.example.SecondHandMarketplace.repository.UserRepository;
import com.example.SecondHandMarketplace.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private OrderRepository orderRepository;



    // ✅ Finalize order from cart items
    @PostMapping("/finalize")
    public ResponseEntity<?> finalizeOrder(@RequestBody Map<String, Object> payload) {
        System.out.println("[OrderController] /finalize called with payload: " + payload);

        try {
            // 🔹 Validate request payload
            if (payload == null || !payload.containsKey("buyerId") || !payload.containsKey("items")) {
                return ResponseEntity.badRequest().body("❌ Missing 'buyerId' or 'items' in request.");
            }

            Long buyerId = Long.parseLong(payload.get("buyerId").toString());
            List<Map<String, Object>> items = (List<Map<String, Object>>) payload.get("items");

            if (items == null || items.isEmpty()) {
                return ResponseEntity.badRequest().body("❌ Items array is empty.");
            }

            // 🔹 Validate Buyer
            User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("Buyer not found with id: " + buyerId));

            List<OrderDTO> orderDTOs = new ArrayList<>();
            List<Product> productsToRemove = new ArrayList<>();

            // 🔹 Process each item in the order request
            for (Map<String, Object> item : items) {
                if (!item.containsKey("productId")) continue;

                Long productId = Long.parseLong(item.get("productId").toString());
                int quantity = (item.get("quantity") != null) ? Integer.parseInt(item.get("quantity").toString()) : 1;

                Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

                if (product.getSeller() == null) {
                    throw new RuntimeException("Product has no seller: " + productId);
                }

                // ✅ Create and save order
                Order order = new Order(
                    buyer,
                    product.getSeller(),
                    product,
                    LocalDateTime.now(),
                    quantity,
                    product.getPrice(),
                    buyer.getEmail(),
                    product.getSeller().getEmail()
                );

                Order savedOrder = orderService.saveOrder(order);
                orderDTOs.add(orderService.mapToDTO(savedOrder));
                productsToRemove.add(product);
            }

            // ✅ Remove products from buyer's cart after all orders are created
            buyer.ensureCartInitialized();
            buyer.getCart().removeAll(productsToRemove);
            userRepository.save(buyer);

            return ResponseEntity.ok(orderDTOs);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("⚠️ Error finalizing order: " + e.getMessage());
        }
    }

    /**
     * Get all orders for a specific buyer
     * @param buyerId ID of the buyer
     * @return List of OrderDTOs with enriched order information
     */
    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<?> getOrdersByBuyer(@PathVariable Long buyerId) {
        if (buyerId == null || buyerId <= 0) {
            return ResponseEntity.badRequest().body("❌ Invalid buyer ID");
        }
        
        try {
            if (!userRepository.existsById(buyerId)) {
                return ResponseEntity.notFound().build();
            }
            
            List<Order> orders = orderRepository.findByBuyerId(buyerId);
            List<OrderDTO> orderDTOs = orderService.mapToDTOList(orders);
            
            return ResponseEntity.ok(orderDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body("Error retrieving buyer orders: " + e.getMessage());
        }
    }

    /**
     * Get all orders for a specific seller
     * @param sellerId ID of the seller
     * @return List of OrderDTOs with enriched order information
     */
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<?> getOrdersBySeller(@PathVariable Long sellerId) {
        if (sellerId == null || sellerId <= 0) {
            return ResponseEntity.badRequest().body("❌ Invalid seller ID");
        }
        
        try {
            if (!userRepository.existsById(sellerId)) {
                return ResponseEntity.notFound().build();
            }
            
            List<Order> orders = orderRepository.findBySellerId(sellerId);
            List<OrderDTO> orderDTOs = orderService.mapToDTOList(orders);
            
            return ResponseEntity.ok(orderDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body("Error retrieving seller orders: " + e.getMessage());
        }
    }
}
