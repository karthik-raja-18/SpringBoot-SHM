import React from 'react';
import {
  FaCheckCircle,
  FaLeaf,
  FaShieldAlt,
  FaUsers,
  FaStore,
  FaTags,
} from 'react-icons/fa';
import Header from './Header';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-container">
      <Header />

      <section className="about-section">
        <div className="about-intro">
          <h2>What is SmartBuy?</h2>
          <p>
            <strong>SmartBuy</strong> is an innovative platform designed to make <span className="highlight-buy">buying</span> and <span className="highlight-sell">selling</span> second-hand items effortless, safe, and sustainable.
            Whether you're clearing space or searching for affordable, high-quality used goods, SmartBuy connects you to a trustworthy community of users in a secure and eco-conscious environment.
          </p>
        </div>

        <div className="about-features">
          <div className="feature-card">
            <FaStore className="feature-icon" />
            <h3>Trusted Marketplace</h3>
            <p>Shop and sell from verified users in a reliable and organized ecosystem.</p>
          </div>

          <div className="feature-card">
            <FaTags className="feature-icon" />
            <h3>Best Deals</h3>
            <p>Discover amazing bargains on pre-owned electronics, furniture, fashion, and more.</p>
          </div>

          <div className="feature-card">
            <FaLeaf className="feature-icon" />
            <h3>Go Green</h3>
            <p>Promote sustainability by giving pre-loved products a second life.</p>
          </div>

          <div className="feature-card">
            <FaShieldAlt className="feature-icon" />
            <h3>Secure Transactions</h3>
            <p>SmartBuy ensures that all payments and user data are protected with top-notch security.</p>
          </div>

          <div className="feature-card">
            <FaUsers className="feature-icon" />
            <h3>Active Community</h3>
            <p>Engage with thousands of like-minded buyers and sellers who value transparency and quality.</p>
          </div>

          <div className="feature-card">
            <FaCheckCircle className="feature-icon" />
            <h3>Quality Listings</h3>
            <p>All product listings are reviewed for authenticity and clarity to help buyers make informed decisions.</p>
          </div>
        </div>
      </section>

      <footer className="about-footer">
        © {new Date().getFullYear()} SmartBuy • Built with ❤️ for a smarter, greener marketplace
      </footer>
    </div>
  );
};

export default AboutUs;
