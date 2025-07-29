import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SellerLayout from './SellerLayout';
import SellerDashboard from './pages/SellerDashboard';
import AddProduct from './pages/AddProduct';
import MyProducts from './pages/MyProducts';
import EditProduct from './pages/EditProduct';

import SellerProfile from './pages/SellerProfile';
import SellerOrders from './pages/SellerOrders';


const SellerRoutes = () => (
  <Routes>
    <Route element={<SellerLayout />}>
      <Route index element={<SellerDashboard />} />
      <Route path="dashboard" element={<SellerDashboard />} />
      <Route path="add-product" element={<AddProduct />} />
      <Route path="my-products" element={<MyProducts />} />
      <Route path="edit-product/:id" element={<EditProduct />} />
      <Route path="orders" element={<SellerOrders />} />
<Route path="profile" element={<SellerProfile />} />
    </Route>
  </Routes>
);

export default SellerRoutes;
