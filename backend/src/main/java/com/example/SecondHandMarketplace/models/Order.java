package com.example.SecondHandMarketplace.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDate;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "buyer_contact", nullable = false)
    private String buyerContact;

    @Column(name = "seller_contact", nullable = false)
    private String sellerContact;

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    public Order() {}

    public Order(User buyer, User seller, Product product, LocalDateTime orderDate,
                 int quantity, BigDecimal price, String buyerContact, String sellerContact) {
        this.buyer = buyer;
        this.seller = seller;
        this.product = product;
        this.orderDate = orderDate != null ? orderDate : LocalDateTime.now();
        setQuantity(quantity);
        setPrice(price);
        this.buyerContact = buyerContact;
        this.sellerContact = sellerContact;
    }

    // ===== Getters and Setters =====

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getBuyer() { return buyer; }
    public void setBuyer(User buyer) { this.buyer = buyer; }

    public User getSeller() { return seller; }
    public void setSeller(User seller) { this.seller = seller; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { 
        this.orderDate = orderDate != null ? orderDate : LocalDateTime.now(); 
    }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }
        this.quantity = quantity;
        recalculateAmount();
    }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) {
        if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Price must be greater than zero");
        }
        this.price = price;
        recalculateAmount();
    }

    public String getBuyerContact() { return buyerContact; }
    public void setBuyerContact(String buyerContact) { this.buyerContact = buyerContact; }

    public String getSellerContact() { return sellerContact; }
    public void setSellerContact(String sellerContact) { this.sellerContact = sellerContact; }

    public BigDecimal getAmount() { return amount; }
    private void setAmount(BigDecimal amount) { this.amount = amount; } // Keep private to enforce calculation

    // ===== Helper Method =====
    private void recalculateAmount() {
        if (price != null && quantity > 0) {
            this.amount = price.multiply(BigDecimal.valueOf(quantity));
        }
    }
}
