import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './SellerNavbar.css'; // ✅ Correct CSS import

const SellerNavbar = ({ sellerName = 'Seller', onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <header className="seller-navbar">
      <div className="navbar-logo">
      <span className="navbar-logo">🛒Smart<span style={{ color: 'white' }}>Buy</span></span>
      </div>
      <nav className="navbar-links">
        <NavLink to="/seller/dashboard" className={({ isActive }) => isActive ? "active-link" : ""}>
          Dashboard
        </NavLink>
        <NavLink to="/seller/add-product" className={({ isActive }) => isActive ? "active-link" : ""}>
          Add Product
        </NavLink>
        <NavLink to="/seller/my-products" className={({ isActive }) => isActive ? "active-link" : ""}>
          My Products
        </NavLink>
        <NavLink to="/seller/orders" className={({ isActive }) => isActive ? "active-link" : ""}>
          Orders
        </NavLink>
        <NavLink to="/seller/profile" className={({ isActive }) => isActive ? "active-link" : ""}>
          Profile
        </NavLink>
      </nav>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </header>
  );
};

export default SellerNavbar;
