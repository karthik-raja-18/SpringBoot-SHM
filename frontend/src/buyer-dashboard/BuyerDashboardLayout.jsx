import React from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import './BuyerDashboard.css';

const BuyerDashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="buyer-layout">
      <nav className="buyer-navbar">
        <div className="navbar-left">
          <span className="navbar-logo">🛒Smart<span style={{ color: 'white' }}>Buy</span></span>
        </div>
        <div className="navbar-center">
          <NavLink to="/buyer/dashboard" activeclassname="active">Dashboard</NavLink>
          <NavLink to="/buyer/wishlist" activeclassname="active">Wishlist</NavLink>
          <NavLink to="/buyer/cart" activeclassname="active">Cart</NavLink>
          <NavLink to="/buyer/orders" activeclassname="active">Orders</NavLink>
          <NavLink to="/buyer/profile" activeclassname="active">Profile</NavLink>
        </div>
        <div className="navbar-right">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="buyer-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default BuyerDashboardLayout;
