import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AddProduct.css';
const AddProduct = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    imageUrl: '',
    quantity: 1,
    isAvailable: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
      await axios.post('/api/products', {
  ...form,
  price: Number(form.price),
  quantity: Number(form.quantity)
}, {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});
      setSuccess(true);
      setForm({
      title: '',
      description: '',
      price: '',
      category: '',
      condition: '',
      imageUrl: '',
      quantity: 1,
      isAvailable: true
    });
    } catch (err) {
      setError(err.response?.data || 'Failed to add product');
    }
    setLoading(false);
  };

  return (
    <div className="add-product-page">
      <h2>Add Product</h2>
      <form className="add-product-form" onSubmit={handleSubmit}>
        <label>Title<input name="title" value={form.title} onChange={handleChange} required /></label>
        <label>Price<input name="price" type="number" value={form.price} onChange={handleChange} required min="0" step="0.01" /></label>
        <label>Description<textarea name="description" value={form.description} onChange={handleChange} required /></label>
        <label>Category
          <select name="category" value={form.category} onChange={handleChange} required>
            <option value="">Select a category</option>
            <option value="ELECTRONICS">Electronics</option>
            <option value="FASHION">Fashion</option>
            <option value="HOME_AND_GARDEN">Home & Garden</option>
            <option value="SPORTS">Sports & Outdoors</option>
            <option value="TOYS">Toys & Games</option>
            <option value="BOOKS">Books & Media</option>
            <option value="BEAUTY">Beauty & Personal Care</option>
            <option value="AUTOMOTIVE">Automotive</option>
            <option value="FURNITURE">Furniture</option>
            <option value="COLLECTIBLES">Collectibles</option>
            <option value="MUSICAL_INSTRUMENTS">Musical Instruments</option>
            <option value="OFFICE_SUPPLIES">Office Supplies</option>
            <option value="TOOLS">Tools & Home Improvement</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
        <label>Condition
          <select name="condition" value={form.condition} onChange={handleChange} required>
            <option value="">Select...</option>
            <option value="NEW">New</option>
            <option value="LIKE_NEW">Like New</option>
            <option value="GOOD">Good</option>
            <option value="FAIR">Fair</option>
            <option value="POOR">Poor</option>
          </select>
        </label>
        <label>Image URL<input name="imageUrl" value={form.imageUrl} onChange={handleChange} /></label>
        <label>Quantity<input name="quantity" type="number" value={form.quantity} onChange={handleChange} min="1" required /></label>
        <label style={{display:'flex',alignItems:'center',gap:4}}>
          <input name="isAvailable" type="checkbox" checked={form.isAvailable} onChange={handleChange} /> Available
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Product'}</button>
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">Product added!</div>}
      </form>
    </div>
  );
};

export default AddProduct;
