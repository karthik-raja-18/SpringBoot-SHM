import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import '../styles/Cart.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/api/cart', { headers: { Authorization: `Bearer ${token}` } });
      setCart(res.data);
    } catch {
      toast.error('Failed to load cart');
    } finally { setLoading(false); }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/api/cart/remove/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchCart();
    } catch { toast.error('Failed to remove item'); }
  };

  const handlePlaceOrder = () => {
    if (!cart.length) return toast.warning('Your cart is empty');
    navigate('/buyer/payment', { 
      state: { 
        cartItems: cart,
        total: cart.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0)
      } 
    });
  };

  const total = cart.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0);

  return (
    <div className="cart">
      <h2>My Cart</h2>
      {loading ? <p>Loading...</p> :
        cart.length === 0 ? <p>Your cart is empty.</p> :
          <>
            <div className="cart-grid">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.imageUrl || 'https://via.placeholder.com/120'} alt={item.title} />
                  <div>
                    <h4>{item.title}</h4>
                    <p>₹{item.price}</p>
                    <button onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary"><strong>Total: ₹{total}</strong></div>
            <button className="place-order-btn" onClick={handlePlaceOrder}>
              Proceed to Payment
            </button>
          </>
      }
    </div>
  );
};

export default Cart;
