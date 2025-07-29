import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Header from './Header';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/products');
        setProducts(res.data);
      } catch (err) {
        setError('Failed to load products.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);


  return (
    <div className="home-container">
      <Header />

      <main className="products-section">
        <h2 className="products-title">Recently Added Products</h2>
        {loading && <p className="status-msg">Loading...</p>}
        {error && <p className="status-msg error">{error}</p>}
        {!loading && !error && (
          products.length === 0 ? (
            <p className="status-msg">No products found.</p>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <img
                    src={product.imageUrl || 'https://via.placeholder.com/120x80/333/fff?text=No+Image'}
                    alt={product.title}
                    className="product-img"
                  />
                  <div className="product-info">
                    <h3>{product.title}</h3>
                    <div style={{marginBottom:'8px', fontSize:'0.98rem', color:'#bbb'}}>{product.category} | {product.condition}</div>
                    <p className="product-price">₹{product.price}</p>
                    <button
                      className="view-btn"
                      onClick={() => {
                        const token = localStorage.getItem('token');
                        if (!token) {
                          // Redirect to login with redirect param
                          navigate(`/login?redirect=/product/${product.id}`);
                        } else {
                          navigate(`/product/${product.id}`);
                        }
                      }}
                    >
                      View Product
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
        
      </main>

      <footer className="home-footer">
        {new Date().getFullYear()} SmartBuy. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
