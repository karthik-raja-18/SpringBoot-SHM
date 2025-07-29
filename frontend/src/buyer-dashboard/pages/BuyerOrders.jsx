import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import '../styles/Orders.css';

const BuyerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const buyerId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/api/orders/buyer/${buyerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    if (buyerId) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [buyerId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="loading">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="no-orders">
        <h2>Your Orders</h2>
        <p>You haven't placed any orders yet.</p>
        <Link to="/products" className="browse-products-btn">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2>Your Orders</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <span className="order-date">Order Placed: {formatDate(order.createdAt)}</span>
                <span className="order-total">Total: ₹{order.totalAmount}</span>
              </div>
              <span className="order-status">{order.status || 'Processing'}</span>
            </div>
            
            <div className="order-items">
              {order.items && order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <img 
                    src={item.product?.imageUrl || 'https://via.placeholder.com/80'} 
                    alt={item.product?.name} 
                    className="product-image"
                  />
                  <div className="item-details">
                    <h4>{item.product?.name || 'Product Name'}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ₹{item.price}</p>
                    {item.seller && (
                      <div className="seller-info">
                        <p>Sold by: {item.seller.name || 'Seller'}</p>
                        <a 
                          href={`mailto:${item.seller.email}?subject=Regarding Order #${order.id}`}
                          className="contact-seller-btn"
                        >
                          Contact Seller
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyerOrders;
