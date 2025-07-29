import React, { useState, useEffect } from 'react';
import '../styles/Wishlist.css';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.get('/api/wishlist', { headers: { Authorization: `Bearer ${token}` } });
      setWishlist(response.data);
    } catch (err) {
      setError('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      await api.delete(`/api/wishlist/remove/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
      setWishlist(prev => prev.filter(product => product.id !== productId)); // Optimistic update
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Wishlist item not found or already removed.');
      } else {
        setError('Failed to remove item');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading wishlist...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="wishlist">
      <h2>My Wishlist</h2>
      {wishlist.length === 0 ? <p>Your wishlist is empty.</p> : (
        <div className="wishlist-grid">
          {wishlist.map(product => (
            <div key={product.id} className="wishlist-item">
              <img src={product.imageUrl || 'https://via.placeholder.com/120x80/333/fff?text=No+Image'} alt={product.title} className="wishlist-item-img" />
              <div className="wishlist-item-info">
                <h4>{product.title}</h4>
                <p>₹{product.price}</p>
                <p style={{ fontSize: '12px', color: '#888' }}>Seller: {product.sellerName || 'Unknown'}</p>
                <button className="btn btn-danger" onClick={() => removeFromWishlist(product.id)}>Remove</button>
                <Link to={`/product/${product.id}`} className="btn btn-primary">View</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
