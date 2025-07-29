import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productAPI from '../../api/productAPI';
import '../styles/Dashboard.css';
const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [cartLoading, setCartLoading] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await productAPI.getAllProducts();
        setProducts(res.data);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const wishlistResult = await productAPI.getWishlist();
      if (wishlistResult && wishlistResult.data) setWishlist(wishlistResult.data.map(p => p.id));
    } catch {}
  };

  const handleAddToCart = async (productId) => {
    setCartLoading(productId);
    try {
      await productAPI.addToCart(productId);
      // Optionally, update local cart state if you track it
      alert('Added to cart! If your cart was full, the oldest item was removed.');
      // You can update a local cart state here if needed
    } catch (err) {
      alert((err.response && err.response.data) || 'Failed to add to cart');
    } finally {
      setCartLoading(null);
    }
  };

  const handleWishlistToggle = async (productId) => {
    setWishlistLoading(productId);
    try {
      if (wishlist.includes(productId)) {
        await productAPI.removeFromWishlist(productId);
      } else {
        await productAPI.addToWishlist(productId);
      }
      // Always refetch after add/remove
      await fetchWishlist();
    } catch (err) {
      alert((err.response && err.response.data) || 'Failed to update wishlist');
    } finally {
      setWishlistLoading(null);
    }
  };

  const handleContactSeller = (product) => {
    // Redirect to conversations or open modal (to be implemented)
    window.location.href = `/buyer/conversations?productId=${product.id}&sellerId=${product.sellerId}`;
  };

  return (
    <div className="buyer-dashboard-content">
      <h2 className="section-header">All Products</h2>
      {loading ? (
        <div className="product-grid">
          {[...Array(6)].map((_, idx) => (
            <div className="dashboard-product-card" key={idx}>
              <div className="skeleton" style={{height:220, width:'100%'}}></div>
              <div className="dashboard-product-info">
                <div className="skeleton" style={{width:'60%', height:22, marginBottom:8}}></div>
                <div className="skeleton" style={{width:'40%', height:18, marginBottom:8}}></div>
                <div className="skeleton" style={{width:'80%', height:16}}></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="error" style={{margin:'40px auto',maxWidth:400,padding:'24px',borderRadius:'12px',background:'rgba(255,77,77,0.08)',borderLeft:'4px solid #ff4d4d',color:'#ff4d4d',fontWeight:600}}>{error}</div>
      ) : products.length === 0 ? (
        <div className="info-banner" style={{margin:'40px auto',maxWidth:400,padding:'24px',borderRadius:'12px',background:'rgba(0,200,150,0.07)',borderLeft:'4px solid #00c896',color:'#00c896',fontWeight:600}}>No products available.</div>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className="dashboard-product-card">
              <button
                className={`dashboard-wishlist-btn${wishlist.includes(product.id) ? ' wishlisted' : ''}`}
                onClick={() => handleWishlistToggle(product.id)}
                disabled={wishlistLoading === product.id}
                aria-label={wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                tabIndex={0}
              >
                {wishlist.includes(product.id) ? '❤️' : '🤍'}
              </button>
              <img
                className="dashboard-product-image"
                src={product.imageUrl || 'https://via.placeholder.com/300x200/333/fff?text=No+Image'}
                alt={product.title}
                onClick={() => window.location.href = `/product/${product.id}`}
                style={{ cursor: 'pointer' }}
                loading="lazy"
              />
              <div className="dashboard-product-info">
                <div className="dashboard-product-title">{product.title}</div>
                <div className="dashboard-product-price">₹{product.price}</div>
                <div className="dashboard-product-seller">Seller: {product.sellerName || 'Unknown'}</div>
                <div className="dashboard-product-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAddToCart(product.id)}
                    disabled={cartLoading === product.id}
                  >
                    {cartLoading === product.id ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <Link to={`/buyer/product/${product.id}`} className="btn btn-outline">View</Link>
                  {/* <button
                    className="btn btn-secondary"
                    onClick={() => handleContactSeller(product)}
                  >
                    Contact Seller
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
