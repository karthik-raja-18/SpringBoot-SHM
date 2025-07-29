import React, { useState } from 'react';
import './LoginModal.css';

const LoginModal = ({ show, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onLogin(username, password);
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  if (!show) return null;

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Login Required</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label>Username
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
          </label>
          <label>Password
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </label>
          {error && <div className="error-msg">{error}</div>}
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
