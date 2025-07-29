import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import ContactModal from '../../components/ContactModal';
import '../styles/MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);
  const [loadingContact, setLoadingContact] = useState(false);
  const navigate = useNavigate();

  const fetchContactInfo = async (userId) => {
    try {
      setLoadingContact(true);
      const token = localStorage.getItem('token');
      const response = await api.get(`/api/user/${userId}/contact`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContactInfo(response.data);
      setContactModalOpen(true);
    } catch (err) {
      console.error('Error fetching contact info:', err);
      toast.error('Failed to load contact information');
    } finally {
      setLoadingContact(false);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      const buyerId = localStorage.getItem('userId');
      if (!token || !buyerId) {
        setError('Login required to fetch orders.');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/api/orders/buyer/${buyerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data || []);
      } catch (err) {
        setError('Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="status-msg">Loading your orders...</div>;
  }

  if (error) {
    return <div className="status-msg error">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <p>You haven't placed any orders yet.</p>
        <Link to="/" className="back-to-shopping">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2>🛒 My Orders</h2>
      <div className="orders-grid">
        {orders.map((order) => (
          <div key={order.orderId || order.id} className="order-card">
            <div className="order-image">
              <img 
                src={order.productImageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} 
                alt={order.productTitle || 'Product'} 
                className="product-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />
            </div>

            <div className="order-details">
              <h3>{order.productTitle || 'Product Name'}</h3>
              <p className="order-price">₹{order.productPrice?.toFixed(2) || '0.00'}</p>
              
              <div className="order-info">
                <p><strong>Seller:</strong> {order.sellerName || 'N/A'}</p>
                <p><strong>Order ID:</strong> {order.orderId || 'N/A'}</p>
                <p><strong>Ordered on:</strong> {formatDate(order.orderDate)}</p>
                <p><strong>Quantity:</strong> {order.quantity || 1}</p>
                <p><strong>Total:</strong> ₹{(order.quantity * order.productPrice)?.toFixed(2) || '0.00'}</p>
                
                <div className="order-actions">
                  <button 
                    className="contact-seller-btn"
                    onClick={() => order.sellerId && fetchContactInfo(order.sellerId)}
                    disabled={loadingContact || !order.sellerId}
                  >
                    {loadingContact ? 'Loading...' : 'Contact Seller'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Contact Seller Modal */}
      <ContactModal 
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        contactInfo={contactInfo || {}}
      />
    </div>
  );
};

export default MyOrders;
