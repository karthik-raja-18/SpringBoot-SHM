import React from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SellerNavbar from './SellerNavbar';
import './SellerLayout.css';

const SellerLayout = () => {
  const navigate = useNavigate();
  const sellerName = 'Seller';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="seller-layout">
      <SellerNavbar sellerName={sellerName} onLogout={handleLogout} />
      <main className="seller-content">
        <Outlet />
      </main>
    </div>
  );
};

export default SellerLayout;
