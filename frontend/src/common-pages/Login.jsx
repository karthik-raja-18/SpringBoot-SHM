import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/auth/login', {
        username: formData.username,
        password: formData.password
      });

      localStorage.setItem('token', response.data.token);
      // Store all user data in a single object for consistency
      const userData = {
        userId: response.data.userId,
        userEmail: response.data.userEmail || response.data.email, // Handle both field names
        roles: response.data.roles || []
      };
      
      // Store in both formats for backward compatibility
      localStorage.setItem('userInfo', JSON.stringify(userData));
      localStorage.setItem('userId', userData.userId);
      localStorage.setItem('userEmail', userData.userEmail);
      localStorage.setItem('token', response.data.token);
      
      const userRole = userData.roles[0] || '';

      if (userRole === 'ROLE_SELLER') {
        navigate('/seller/dashboard');
      } else if (userRole === 'ROLE_BUYER') {
        navigate('/buyer/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        setError('Invalid username or password');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form">
          <div className="form-header">
            <h1>SmartBuy</h1>
            <p>Please log in to continue</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="form-footer">
            <p>
              Don't have an account?
              <Link to="/register" className="link"> Register here</Link>
            </p>
            <Link to="/" className="link back-link">← Back to Home</Link>
          </div>
        </div>

        <div className="login-side">
          <div className="info-block">
            <h3>🛍️ For Buyers</h3>
            <p>Browse and buy quality second-hand items at low prices.</p>
          </div>
          <div className="info-block">
            <h3>💰 For Sellers</h3>
            <p>List items you no longer need and make quick sales.</p>
          </div>
          <div className="info-block">
            <h3>🔒 Safe & Secure</h3>
            <p>Your data and transactions are fully protected.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
