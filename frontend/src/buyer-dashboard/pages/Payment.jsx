import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Payment.css';
import { toast } from 'react-toastify';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderSummary, setOrderSummary] = useState({
    items: [],
    total: 0,
    buyerId: ''
  });

  useEffect(() => {
    if (location.state?.cartItems) {
      setOrderSummary({
        items: location.state.cartItems,
        total: location.state.total,
        buyerId: localStorage.getItem('userId')
      });
    } else {
      toast.error('No items in cart');
      navigate('/cart');
    }
  }, [location, navigate]);

  const confirmPayment = async () => {
    if (!window.confirm('Confirm payment for this order?')) return;
    
    setProcessing(true);
    const token = localStorage.getItem('token');
    
    try {
      const payload = {
        buyerId: orderSummary.buyerId,
        items: orderSummary.items.map(item => ({
          productId: item.id,
          quantity: item.quantity || 1,
          price: item.price
        }))
      };

      await api.post('/api/orders/finalize', payload, { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      toast.success('Payment Successful! Order Created.');
      setSuccess(true);
      setTimeout(() => navigate('/buyer/orders'), 2000);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="payment">
      {!success ? (
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-items">
            {orderSummary.items.map((item) => (
              <div key={item.id} className="order-item">
                <img src={item.imageUrl || 'https://via.placeholder.com/80'} alt={item.title} />
                <div className="item-details">
                  <h4>{item.title}</h4>
                  <p>Quantity: {item.quantity || 1}</p>
                  <p>Price: ₹{item.price}</p>
                </div>
                <div className="item-total">
                  ₹{item.price * (item.quantity || 1)}
                </div>
              </div>
            ))}
          </div>
          <div className="order-total">
            <strong>Total: ₹{orderSummary.total}</strong>
          </div>
          <div className="payment-actions">
            <button 
              className="pay-now-btn" 
              onClick={confirmPayment} 
              disabled={processing || orderSummary.items.length === 0}
            >
              {processing ? 'Processing...' : 'Pay Now'}
            </button>
            <button 
              className="cancel-btn" 
              onClick={() => navigate('/buyer/cart')}
              disabled={processing}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="payment-success">
          <h2>✅ Order Placed Successfully!</h2>
          <p>Redirecting you to your Orders page...</p>
        </div>
      )}
    </div>
  );
};

export default Payment;
