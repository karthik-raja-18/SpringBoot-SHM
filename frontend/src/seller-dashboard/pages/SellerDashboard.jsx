import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import '../styles/SellerDashboard.css';
import '../styles/MyProducts.css';

const SellerDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const sellerId = localStorage.getItem('userId');
      if (!sellerId) {
        setError('Seller ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      const [productsRes, ordersRes] = await Promise.all([
        api.get('/api/products/my-products', { headers: { Authorization: `Bearer ${token}` } }),
        api.get(`/api/orders/seller/${sellerId}`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      // Process products response
      let products = [];
      if (Array.isArray(productsRes.data)) {
        products = productsRes.data;
      } else if (productsRes.data && Array.isArray(productsRes.data.products)) {
        products = productsRes.data.products;
      }

      // Process orders response
      let orders = [];
      if (Array.isArray(ordersRes.data)) {
        orders = ordersRes.data;
      } else if (ordersRes.data && Array.isArray(ordersRes.data.orders)) {
        orders = ordersRes.data.orders;
      }

      console.log('Raw orders response:', ordersRes);
      console.log('Processed orders:', orders);
      if (orders.length > 0) {
        console.log('First order details:', JSON.stringify(orders[0], null, 2));
      }

      if (!Array.isArray(products)) {
        setError('Unexpected products data format.');
        return;
      }


      // Calculate statistics
      const totalProducts = products.length;
      const activeProducts = products.filter(p => p.available).length;
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => o.status === 'PENDING').length;

      // Update stats state
      setStats({
        totalProducts,
        activeProducts,
        totalOrders,
        pendingOrders
      });

      // Set recent items for display
      setRecentProducts(products.slice(0, 5));
      setRecentOrders(orders.slice(0, 5));

    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="seller-dashboard">
      <header className="dashboard-header">
        <h1>SmartBuy Seller Dashboard</h1>
        <button className="logout-btn" onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }}>
          Logout
        </button>
        <p>Manage your products and track orders in one place.</p>
      </header>

      {/* Stats */}
      <div className="stats-container">
        {[
          { icon: '📦', label: 'Total Products', value: stats.totalProducts || 0 },
          { icon: '✅', label: 'Active Products', value: stats.activeProducts || 0 },
          { icon: '📋', label: 'Total Orders', value: stats.totalOrders || 0 }
        ].map((stat, idx) => (
          <div className="stat-card" key={idx}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      {/* <section className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/seller/add-product" className="action-btn primary">➕ Add Product</Link>
          <Link to="/seller/my-products" className="action-btn secondary">📦 Manage Products</Link>
          <Link to="/seller/orders" className="action-btn secondary">📋 View Orders</Link>
        </div>
      </section> */}

      {/* Recent Products */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Recent Products</h2>
          <Link to="/seller/my-products" className="view-all-link">View All</Link>
        </div>
        {recentProducts.length > 0 ? (
          <div className="recent-grid">
            {recentProducts.map(p => (
              <div key={p.id} className="recent-card">
                <img src={p.imageUrl || 'https://via.placeholder.com/300x200/333/fff?text=No+Image'} alt={p.title} />
                <div className="card-info">
                  <h4>{p.title}</h4>
                  <p>₹{p.price}</p>
                  <span className={p.available ? 'status active' : 'status inactive'}>
                    {p.available ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No products added. <Link to="/seller/add-product">Add your first product</Link>.</p>
        )}
      </section>

      {/* Recent Orders */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Recent Orders</h2>
          <Link to="/seller/orders" className="view-all-link">View All</Link>
        </div>
        {recentOrders.length > 0 ? (
          <div className="recent-grid">
            {recentOrders.map(order => (
              <div key={order.orderId} className="recent-card">
                <div className="card-info">
                  <h4>Order #{order.orderId || 'N/A'}</h4>
                  <p>Product: {order.productTitle || 'N/A'}</p>
                  <p>Qty: {order.quantity || 1}</p>
                  <p>Amount: ₹{order.amount || order.productPrice || 'N/A'}</p>
                  {order.buyerName && <p>Buyer: {order.buyerName}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No orders received yet.</p>
        )}
      </section>
    </div>
  );
};

export default SellerDashboard;
