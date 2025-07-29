import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    imageUrl: '',
    quantity: 1,
    seller: {}
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await api.get(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);


  if (loading) return <div className="loading">Loading product details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div className="product-detail-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back to Products
      </button>

      <div className="product-detail">
        <div className="product-image-container">
          <img 
            src={product.imageUrl || 'https://via.placeholder.com/500x500?text=No+Image'} 
            alt={product.title} 
            className="product-image"
          />
        </div>

        <div className="product-info">
          <h1>{product.title}</h1>
          <p className="price">₹{product.price}</p>

          <div className="product-meta">
            <p><strong>Category:</strong> {product.category || 'N/A'}</p>
            <p><strong>Condition:</strong> {product.condition || 'N/A'}</p>
            <p><strong>Seller:</strong> {product.seller?.name || 'N/A'}</p>
          </div>

          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity : 1</label>
            
            
          </div>

          

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description || 'No description available.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
