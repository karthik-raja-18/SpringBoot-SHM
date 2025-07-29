import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    address: '',
    role: 'BUYER' // Default to buyer
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.name.trim()) {
      setError('Full name is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        role: undefined, // remove this field
        roles: [formData.role === 'BUYER' ? 'ROLE_BUYER' : 'ROLE_SELLER'] // Backend expects array of role names
      };

      await api.post('/api/auth/register', registrationData);

      setSuccess('Account created successfully! Please sign in to continue.');
      
      // Clear form
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        address: '',
        role: 'BUYER'
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 400) {
        setError('Username or email already exists');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="register-container">
        <div className="register-form">
          <div className="form-header">
            <h1>Create Account</h1>
            <p>Join our marketplace to buy and sell amazing items</p>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit}>
            {/* Account Type Selection */}
            <div className="form-group">
              <label>Account Type</label>
              <div className="role-selection">
                <label className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value="BUYER"
                    checked={formData.role === 'BUYER'}
                    onChange={handleChange}
                  />
                  <span className="role-content">
                    <strong>🛍️ Buyer</strong>
                    <small>Browse and purchase items</small>
                  </span>
                </label>
                <label className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value="SELLER"
                    checked={formData.role === 'SELLER'}
                    onChange={handleChange}
                  />
                  <span className="role-content">
                    <strong>💰 Seller</strong>
                    <small>List and sell your items</small>
                  </span>
                </label>
              </div>
            </div>

            {/* Basic Information */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">Username *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            {/* Personal Information */}
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
  <label htmlFor="phone">Phone Number</label>
  <input
    type="tel"
    id="phone"
    name="phone"
    value={formData.phone}
    onChange={handleChange}
    placeholder="Enter your phone number"
  />
</div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                rows="3"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="form-footer">
            <p>
              Already have an account? 
              <Link to="/login" className="link">Sign in here</Link>
            </p>
            <Link to="/" className="link">← Back to Home</Link>
          </div>
        </div>

        <div className="register-info">
          <div className="info-section">
            <h3>Why Join Us?</h3>
            <ul>
              <li>🌟 Quality pre-owned items at great prices</li>
              <li>🔒 Secure and safe transactions</li>
              <li>💬 Direct communication with buyers/sellers</li>
              <li>📱 Easy-to-use platform</li>
            </ul>
          </div>
          <div className="info-section">
            <h3>Getting Started</h3>
            <p>
              Choose your account type based on your primary goal. You can always contact support to change your account type later if needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
