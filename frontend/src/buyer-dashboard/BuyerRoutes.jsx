import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';
import BuyerDashboardLayout from './BuyerDashboardLayout';

const BuyerRoutes = () => {
  return (
    <Routes>
      <Route element={<BuyerDashboardLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="cart" element={<Cart />} />
<Route path="profile" element={<Profile />} />
        <Route path="payment" element={<Payment />} />
        <Route path="orders" element={<MyOrders />} />
        <Route path="product/:id" element={<ProductDetail />} />
      </Route>
    </Routes>
  );
};

export default BuyerRoutes;
