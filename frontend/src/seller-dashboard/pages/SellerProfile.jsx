  import React, { useState, useEffect } from 'react';
  import api from '../../api/axios';
  import '../styles/SellerProfile.css';

  const SellerProfile = () => {
    const [profile, setProfile] = useState({
      name: '',
      email: '',
      phone: '',
      address: '',
      username: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
      fetchProfile();
    }, []);

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('You must be logged in to view your profile');
          return;
        }

        const response = await api.get('/api/user/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setProfile({
          name: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
          username: response.data.username || ''
        });

      } catch (err) {
        console.error('Error fetching profile:', err);
        if (err.response?.status === 401) {
          setError('You must be logged in to view your profile');
        } else {
          setError('Failed to load profile. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
      // Clear messages when user starts typing
      if (error) setError('');
      if (success) setSuccess('');
    };

    const validateForm = () => {
      if (!profile.name.trim()) {
        setError('Name is required');
        return false;
      }
      if (!profile.email.trim()) {
        setError('Email is required');
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(profile.email)) {
        setError('Please enter a valid email address');
        return false;
      }
      return true;
    };

    const handleSave = async () => {
      if (!validateForm()) {
        return;
      }

      setSaving(true);
      setError('');
      setSuccess('');

      try {
        const token = localStorage.getItem('token');
        
        const updateData = {
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address
        };

        await api.put('/api/user/me', updateData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setSuccess('Profile updated successfully!');
        setIsEditing(false);

      } catch (err) {
        console.error('Error updating profile:', err);
        if (err.response?.status === 401) {
          setError('You must be logged in to update your profile');
        } else {
          setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
        }
      } finally {
        setSaving(false);
      }
    };

    const handleCancel = () => {
      setIsEditing(false);
      setError('');
      setSuccess('');
      // Reset form to original values
      fetchProfile();
    };

    if (loading) {
      return <div className="loading">Loading profile...</div>;
    }

    if (error && !profile.name) {
      return <div className="error">{error}</div>;
    }

    return (
      <div className="seller-profile">
        <div className="page-header">
          <div className="header-content">
            <h1>Seller Profile</h1>
            <p>Manage your seller account information</p>
          </div>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="btn btn-primary"
            >
              <span className="btn-icon">✏️</span>
              Edit Profile
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="profile-container">
          <div className="profile-form">
            <div className="form-section">
              <h2>Personal Information</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  ) : (
                    <div className="profile-value">{profile.name || 'Not provided'}</div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  {isEditing ? (
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      required
                    />
                  ) : (
                    <div className="profile-value">{profile.email || 'Not provided'}</div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="profile-value">{profile.phone || 'Not provided'}</div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  {isEditing ? (
                    <textarea
                      id="address"
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                      rows="3"
                    />
                  ) : (
                    <div className="profile-value">{profile.address || 'Not provided'}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Account Information</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <div className="profile-value readonly">
                    {profile.username || 'Not available'}
                    <span className="readonly-note">Username cannot be changed</span>
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>

          <div className="profile-sidebar">
            <div className="profile-stats">
              <h3>Account Statistics</h3>
              <div className="stat-item">
                <span className="stat-label">Account Type:</span>
                <span className="stat-value">Seller</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Member Since:</span>
                <span className="stat-value">2024</span>
              </div>
            </div>

            <div className="profile-tips">
              <h3>Profile Tips</h3>
              <ul>
                <li>Keep your contact information up to date for better communication with buyers</li>
                <li>A complete profile builds trust with potential customers</li>
                <li>Your email is used for order notifications and account security</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default SellerProfile;
