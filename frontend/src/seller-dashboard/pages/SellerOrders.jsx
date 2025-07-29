import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import ContactModal from '../../components/ContactModal';
import '../../styles/ContactModal.css';
import '../styles/SellerOrders.css';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);
  const [loadingContact, setLoadingContact] = useState(false);
  const sellerId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const fetchContactInfo = async (buyerId) => {
    try {
      setLoadingContact(true);
      const token = localStorage.getItem('token');
      const response = await api.get(`/api/user/${buyerId}/contact`, {
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
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/api/orders/seller/${sellerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data || []);
      } catch (error) {
        console.error('Error fetching seller orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    if (sellerId) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [sellerId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  if (loading) return <div className="status-msg">Loading your orders...</div>;

  if (!sellerId) return <div className="status-msg error">Please log in to view your orders.</div>;

  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <p>You don't have any orders yet.</p>
        <Link to="/seller/dashboard" className="back-to-dashboard">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2>📦 Orders Received</h2>
      <div className="orders-grid">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <p className="order-date">
                <strong>Ordered on:</strong> {formatDate(order.orderDate)}
              </p>
            </div>

            <div className="order-buyer-info">
              <p><strong>Buyer:</strong> {order.buyerName || 'N/A'}</p>
              <div className="buyer-contact-actions">
                <button 
                  className="contact-buyer-btn"
                  onClick={() => order.buyerId && fetchContactInfo(order.buyerId)}
                  disabled={loadingContact || !order.buyerId}
                >
                  {loadingContact ? 'Loading...' : 'View Contact Info'}
                </button>
                
              </div>
            </div>

            <div className="order-item">
              <div className="item-image">
                <img
                  src={order.productImageUrl || 'https://via.placeholder.com/100x100?text=No+Image'}
                  alt={order.productName || 'Product'}
                />
              </div>
              <div className="item-details">
                <h4>{order.productName || 'Product Name'}</h4>
                <p>Quantity: {order.quantity}</p>
                <p>Subtotal: ₹{order.amount?.toFixed(2)}</p>
              </div>
            </div>

            <div className="order-total">
              <strong>Total: ₹{order.amount?.toFixed(2)}</strong>
            </div>

            
          </div>
        ))}
      </div>
      
      {/* Contact Buyer Modal */}
      <ContactModal 
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        contactInfo={contactInfo || {}}
      />
    </div>
  );
};

export default SellerOrders;
