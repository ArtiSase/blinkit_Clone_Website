import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Globe, Mail, Share2, Megaphone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="logo-icon sm">
              <Zap size={16} fill="white" />
            </div>
            <span>blinkit clone</span>
          </div>
          <p className="footer-tagline">Groceries delivered in 10 minutes</p>
          <div className="footer-socials">
            <a href="#" aria-label="Website"><Globe size={18} /></a>
            <a href="#" aria-label="Email"><Mail size={18} /></a>
            <a href="#" aria-label="Share"><Share2 size={18} /></a>
            <a href="#" aria-label="Updates"><Megaphone size={18} /></a>
          </div>
        </div>

        {/* Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/login">Login</Link>
          <Link to="/checkout">Checkout</Link>
        </div>

        <div className="footer-links">
          <h4>Categories</h4>
          <Link to="/?cat=fruits-vegetables">Fruits & Vegetables</Link>
          <Link to="/?cat=dairy-breakfast">Dairy & Breakfast</Link>
          <Link to="/?cat=munchies">Munchies</Link>
          <Link to="/?cat=personal-care">Personal Care</Link>
        </div>

        <div className="footer-links">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Blog</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 Blinkit Clone. Built for practice & learning purposes only.</p>
        <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>
          Not affiliated with Blinkit. This is a frontend practice project.
        </p>
      </div>
    </footer>
  );
}
