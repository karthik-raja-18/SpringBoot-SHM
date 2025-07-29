package com.example.SecondHandMarketplace.services;

import com.example.SecondHandMarketplace.models.Order;
import com.example.SecondHandMarketplace.models.Product;
import com.example.SecondHandMarketplace.models.User;
import com.example.SecondHandMarketplace.dto.OrderDTO;
import com.example.SecondHandMarketplace.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    // ✅ Save a single order
    public Order saveOrder(Order order) {
        if (order == null) {
            throw new IllegalArgumentException("Order cannot be null");
        }
        return orderRepository.save(order);
    }

    // ✅ Save multiple orders
    public List<Order> saveOrders(List<Order> orders) {
        if (orders == null || orders.isEmpty()) {
            throw new IllegalArgumentException("Order list cannot be null or empty");
        }
        return orderRepository.saveAll(orders);
    }

    // ✅ Get Buyer Orders as DTOs
    public List<OrderDTO> getOrderDTOsByBuyer(Long buyerId) {
        List<Order> orders = orderRepository.findByBuyerId(buyerId);
        return mapToDTOList(orders);
    }

    // ✅ Get Seller Orders as DTOs
    public List<OrderDTO> getOrderDTOsBySeller(Long sellerId) {
        List<Order> orders = orderRepository.findBySellerId(sellerId);
        return mapToDTOList(orders);
    }

    // ===== Helper Methods =====

    // 🔹 Convert List<Order> → List<OrderDTO>
    public List<OrderDTO> mapToDTOList(List<Order> orders) {
        List<OrderDTO> dtos = new ArrayList<>();
        if (orders != null) {
            for (Order order : orders) {
                dtos.add(mapToDTO(order));
            }
        }
        return dtos;
    }

    /**
     * Converts an Order entity to an OrderDTO with enriched details
     * @param order The order entity to convert
     * @return OrderDTO with all relevant fields populated
     */
    public OrderDTO mapToDTO(Order order) {
        if (order == null) return null;

        OrderDTO dto = new OrderDTO();
        
        // Set order information
        dto.setOrderId(order.getId());
        dto.setOrderDate(order.getOrderDate());
        dto.setQuantity(order.getQuantity());
        
        // Set product details
        if (order.getProduct() != null) {
            Product product = order.getProduct();
            dto.setProductId(product.getId());
            dto.setProductTitle(product.getTitle());
            dto.setProductImageUrl(product.getImageUrl());
            dto.setProductDescription(product.getDescription());
            dto.setProductCondition(product.getCondition());
            dto.setProductPrice(product.getPrice());
            
            // Calculate amount if not set
            if (order.getAmount() == null && product.getPrice() != null) {
                BigDecimal amount = product.getPrice().multiply(BigDecimal.valueOf(order.getQuantity()));
                dto.setAmount(amount);
            } else {
                dto.setAmount(order.getAmount());
            }
        }
        
        // Set buyer information
        if (order.getBuyer() != null) {
            User buyer = order.getBuyer();
            dto.setBuyerId(buyer.getId());
            dto.setBuyerName(buyer.getName());
            dto.setBuyerEmail(buyer.getEmail());
            dto.setBuyerContact(order.getBuyerContact() != null ? 
                order.getBuyerContact() : buyer.getEmail());
            dto.setBuyerAddress(buyer.getAddress());
        } else {
            dto.setBuyerContact(order.getBuyerContact());
        }
        
        // Set seller details with null checks
        if (order.getSeller() != null) {
            User seller = order.getSeller();
            dto.setSellerId(seller.getId());
            dto.setSellerName(seller.getName());
            dto.setSellerEmail(seller.getEmail());
            dto.setSellerContact(order.getSellerContact() != null ? 
                order.getSellerContact() : seller.getEmail());
        } else {
            dto.setSellerContact(order.getSellerContact());
        }

        return dto;
    }
}
