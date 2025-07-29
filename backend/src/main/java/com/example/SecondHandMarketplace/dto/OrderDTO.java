package com.example.SecondHandMarketplace.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OrderDTO {
    private Long orderId;
    private LocalDateTime orderDate;

    // Product Info
    private Long productId;
    private String productTitle;
    private String productImageUrl;
    private String productDescription;
    private String productCondition;
    private BigDecimal productPrice;

    // Order Info
    private int quantity;
    private BigDecimal amount;

    // Buyer Info
    private Long buyerId;
    private String buyerName;
    private String buyerEmail;
    private String buyerContact;
    private String buyerAddress;

    // Seller Info
    private Long sellerId;
    private String sellerName;
    private String sellerEmail;
    private String sellerContact;

    public OrderDTO() {}

    // ============ Getters and Setters ============

    public Long getOrderId() {
        return orderId;
    }
    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }
    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public Long getProductId() {
        return productId;
    }
    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductTitle() {
        return productTitle;
    }
    public void setProductTitle(String productTitle) {
        this.productTitle = productTitle;
    }

    public String getProductImageUrl() {
        return productImageUrl;
    }
    public void setProductImageUrl(String productImageUrl) {
        this.productImageUrl = productImageUrl;
    }

    public String getProductDescription() {
        return productDescription;
    }
    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    public String getProductCondition() {
        return productCondition;
    }
    public void setProductCondition(String productCondition) {
        this.productCondition = productCondition;
    }

    public BigDecimal getProductPrice() {
        return productPrice;
    }
    public void setProductPrice(BigDecimal productPrice) {
        this.productPrice = productPrice;
    }

    public int getQuantity() {
        return quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getAmount() {
        return amount;
    }
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Long getBuyerId() {
        return buyerId;
    }
    public void setBuyerId(Long buyerId) {
        this.buyerId = buyerId;
    }

    public String getBuyerName() {
        return buyerName;
    }
    public void setBuyerName(String buyerName) {
        this.buyerName = buyerName;
    }

    public String getBuyerEmail() {
        return buyerEmail;
    }
    public void setBuyerEmail(String buyerEmail) {
        this.buyerEmail = buyerEmail;
    }

    public String getBuyerContact() {
        return buyerContact;
    }
    public void setBuyerContact(String buyerContact) {
        this.buyerContact = buyerContact;
    }

    public String getBuyerAddress() {
        return buyerAddress;
    }
    public void setBuyerAddress(String buyerAddress) {
        this.buyerAddress = buyerAddress;
    }

    public Long getSellerId() {
        return sellerId;
    }
    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }

    public String getSellerName() {
        return sellerName;
    }
    public void setSellerName(String sellerName) {
        this.sellerName = sellerName;
    }

    public String getSellerEmail() {
        return sellerEmail;
    }
    public void setSellerEmail(String sellerEmail) {
        this.sellerEmail = sellerEmail;
    }

    public String getSellerContact() {
        return sellerContact;
    }
    public void setSellerContact(String sellerContact) {
        this.sellerContact = sellerContact;
    }
}
