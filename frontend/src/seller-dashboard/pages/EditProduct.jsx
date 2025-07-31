import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productAPI from '../../api/productAPI';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    const fetchProduct = async () => {
      try {
        const response = await productAPI.getProduct(id);
        const product = response.data;
        
        // Ensure all fields exist for controlled inputs
        setForm({
          title: product.title || '',
          description: product.description || '',
          price: product.price || '',
          category: product.category || '',
          condition: product.condition || '',
          imageUrl: product.imageUrl || '',
          available: typeof product.available === 'boolean' ? product.available : true
        });
      } catch (err) {
        console.error('Error fetching product:', err);
        const errorMessage = err.response?.data?.message || 'Failed to load product';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
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
      const productData = {
        ...form,
        price: Number(form.price),
      };
      
      await productAPI.updateProduct(id, productData);
      
      setSuccess(true);
      toast.success('Product updated successfully!');
      setTimeout(() => navigate('/seller/my-products'), 1000);
    } catch (err) {
      console.error('Error updating product:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update product';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading product details...</div>;

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
