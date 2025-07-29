import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Header = () => (
  <header className="home-header">
    <div className="nav-left">
      <h1 className="project-title">SmartBuy</h1>
      
    </div>
    <nav className="nav-right">
      <Link to="/about" className="nav-link">About</Link>
      <Link to="/login" className="nav-link">Login</Link>
      <Link to="/register" className="nav-link">Register</Link>
    </nav>
  </header>
);

export default Header;
