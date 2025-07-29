import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import '../styles/MyProducts.css';

const MyProducts = () => {
  // const navigate = useNavigate(); // Removed as unused
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const categories = [
    'Electronics',
    'Clothing',
    'Home & Kitchen',
    'Books',
    'Sports & Outdoors',
    'Toys & Games',
    'Automotive',
    'Health & Beauty',
    'Jewelry',
    'Other'
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You must be logged in to view your products');
        return;
      }

      const response = await api.get('/api/products/my-products', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      if (err.response?.status === 401) {
        setError('You must be logged in as a seller to view products');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to view products');
      } else {
        setError('Failed to load products. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId, productTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${productTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleteLoading(productId);
      const token = localStorage.getItem('token');

      await api.delete(`/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove the deleted product from the state
      setProducts(prev => prev.filter(product => product.id !== productId));
      
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const toggleAvailability = async (productId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const product = products.find(p => p.id === productId);
      
      const updatedProduct = {
        ...product,
        available: !currentStatus
      };

      await api.put(`/api/products/${productId}`, updatedProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update the product in the state
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, available: !currentStatus } : p
      ));
      
    } catch (err) {
      console.error('Error updating product availability:', err);
      alert('Failed to update product availability. Please try again.');
    }
  };

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    const matchesStatus = !filterStatus || 
                         (filterStatus === 'available' && product.available) ||
                         (filterStatus === 'unavailable' && !product.available);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return <div className="loading">Loading your products...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="my-products">
      <div className="page-header">
        <div className="header-content">
          <h1>Manage Products</h1>
          <p>View, edit, and manage your listed products</p>
        </div>
        <Link to="/seller/add-product" className="btn add-product-btn">
          <span className="btn-icon">➕</span>
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-controls">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>No products found</h2>
          {products.length === 0 ? (
            <p>You haven't listed any products yet. <Link to="/seller/add-product">Add your first product</Link></p>
          ) : (
            <p>No products match your current filters.</p>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img 
                  src={product.imageUrl || 'https://via.placeholder.com/300x200/333/fff?text=No+Image'} 
                  alt={product.title}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200/333/fff?text=No+Image';
                  }}
                />
                <div className="product-status">
                  <span className={`status ${product.available ? 'available' : 'unavailable'}`}>
                    {product.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
              
              <div className="product-content">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-details">
                  <span className="product-price">₹{product.price}</span>
                  <span className="product-category">{product.category}</span>
                  <span className="product-quantity">Qty: {product.quantity || 1}</span>
                </div>
                <div className="product-meta">
                  <span className="product-condition">{product.condition}</span>
                  <span className="product-date">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="product-actions">
                <button
                  onClick={() => toggleAvailability(product.id, product.available)}
                  className={`btn btn-sm ${product.available ? 'btn-warning' : 'btn-success'}`}
                  title={product.available ? 'Mark as unavailable' : 'Mark as available'}
                >
                  {product.available ? '👁️‍🗨️' : '👁️'}
                </button>
                <Link
                  to={`/seller/edit-product/${product.id}`}
                  className="btn btn-sm btn-secondary"
                  title="Edit product"
                >
                  ✏️
                </Link>
                <button
                  onClick={() => handleDelete(product.id, product.title)}
                  className="btn btn-sm btn-danger"
                  disabled={deleteLoading === product.id}
                  title="Delete product"
                >
                  {deleteLoading === product.id ? '⏳' : '🗑️'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {products.length > 0 && (
        <div className="products-summary">
          <p>
            Showing {filteredProducts.length} of {products.length} products
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
