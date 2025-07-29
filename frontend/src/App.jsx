import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './common-pages/Home.css';

// Lazy load components
const Home = lazy(() => import('./common-pages/Home'));
const Login = lazy(() => import('./common-pages/Login'));
const Register = lazy(() => import('./common-pages/Register'));
const SellerRoutes = lazy(() => import('./seller-dashboard/SellerRoutes'));
const BuyerRoutes = lazy(() => import('./buyer-dashboard/BuyerRoutes'));
const AboutUs = lazy(() => import('./common-pages/AboutUs'));

// Loading component
const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
    <div style={{ width: 40, height: 40, border: '4px solid #eee', borderTop: '4px solid #1976d2', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

function AppContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#fafcff', color: '#222' }}>

      <Suspense fallback={<Loading />}>
        <main style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<AboutUs />} />
            

            {/* Seller Dashboard: all seller pages with sidebar and routing */}
            <Route 
              path="/seller/*" 
              element={
                <Suspense fallback={<Loading />}>
                  <SellerRoutes />
                </Suspense>
              } 
            />
            
            {/* Buyer Dashboard: all buyer pages */}
            <Route 
              path="/buyer/*" 
              element={
                <Suspense fallback={<Loading />}>
                  <BuyerRoutes />
                </Suspense>
              } 
            />
            {/* Redirect any unknown paths to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        

      </Suspense>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;