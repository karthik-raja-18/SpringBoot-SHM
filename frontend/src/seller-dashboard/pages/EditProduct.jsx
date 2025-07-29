import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/EditProduct.css';
const EditProduct = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
  title: '',
  description: '',
  price: '',
  category: '',
  condition: '',
  imageUrl: '',
  available: true
});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/products/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => {
        // Ensure all fields exist for controlled inputs
        setForm({
          title: res.data.title || '',
          description: res.data.description || '',
          price: res.data.price || '',
          category: res.data.category || '',
          condition: res.data.condition || '',
          imageUrl: res.data.imageUrl || '',
          available: typeof res.data.available === 'boolean' ? res.data.available : true
        });
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load product');
        setLoading(false);
      });
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await axios.put(`/api/products/${id}`,
        {
          ...form,
          price: Number(form.price),
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSuccess(true);
      setTimeout(() => navigate('/seller/my-products'), 1000);
    } catch (err) {
      setError(err.response?.data || 'Failed to update product');
    }
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="edit-product-page">
      <h2>Edit Product</h2>
      <form className="edit-product-form" onSubmit={handleSubmit}>
        <label>Title<input name="title" value={form.title} onChange={handleChange} required /></label>
        <label>Price<input name="price" type="number" value={form.price} onChange={handleChange} required min="0" /></label>
        <label>Description<textarea name="description" value={form.description} onChange={handleChange} required /></label>
        <label>Category
          <select name="category" value={form.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Books">Books</option>
            <option value="Sports & Outdoors">Sports & Outdoors</option>
            <option value="Toys & Games">Toys & Games</option>
            <option value="Automotive">Automotive</option>
            <option value="Health & Beauty">Health & Beauty</option>
            <option value="Jewelry">Jewelry</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label>Condition
          <select name="condition" value={form.condition} onChange={handleChange} required>
            <option value="">Select Condition</option>
            <option value="New">New</option>
            <option value="Used - Like New">Used - Like New</option>
            <option value="Used - Good">Used - Good</option>
            <option value="Used - Acceptable">Used - Acceptable</option>
          </select>
        </label>
        <label>Image URL<input name="imageUrl" value={form.imageUrl} onChange={handleChange} /></label>
        <label>
          <input type="checkbox" name="available" checked={form.available} onChange={handleChange} />
          Available
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">Product updated!</div>}
      </form>
    </div>
  );
};

export default EditProduct;
