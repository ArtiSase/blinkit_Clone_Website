import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, MapPin, X, Menu, ChevronDown, User, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { searchProducts } from '../data/products';

export default function Navbar({ onSearch, searchQuery, onLocationChange }) {
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState(searchQuery || '');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationText, setLocationText] = useState('Bengaluru, Karnataka');
  const [locationDropdown, setLocationDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);
  const locationRef = useRef(null);

  const popularLocations = [
    'Bengaluru, Karnataka',
    'Mumbai, Maharashtra',
    'Delhi, NCR',
    'Hyderabad, Telangana',
    'Pune, Maharashtra',
    'Chennai, Tamil Nadu',
  ];

  // Sync query when parent changes (e.g. clear search)
  useEffect(() => {
    setQuery(searchQuery || '');
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setLocationDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (value) => {
    setQuery(value);
    if (value.trim()) {
      const results = searchProducts(value).slice(0, 5);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
    if (onSearch) onSearch(value);
    if (location.pathname !== '/') navigate('/');
  };

  const handleSuggestionClick = (product) => {
    setQuery(product.name);
    setSuggestions([]);
    if (onSearch) onSearch(product.name);
    navigate('/');
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    if (onSearch) onSearch('');
  };

  const handleLocationSelect = (loc) => {
    setLocationText(loc);
    setLocationDropdown(false);
    if (onLocationChange) onLocationChange(loc);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={clearSearch}>
          <div className="logo-icon">
            <Zap size={20} fill="white" />
          </div>
          <span className="logo-text">blinkit</span>
          <span className="logo-tagline">clone</span>
        </Link>

        {/* Delivery Location */}
        <div className="navbar-location" ref={locationRef}>
          <button
            className="location-btn"
            onClick={() => setLocationDropdown(!locationDropdown)}
          >
            <MapPin size={16} className="location-icon" />
            <div className="location-info">
              <span className="delivery-label">Delivery in <strong>10 min</strong></span>
              <span className="location-name">
                {locationText.split(',')[0]}
                <ChevronDown size={14} style={{ marginLeft: 4 }} />
              </span>
            </div>
          </button>
          {locationDropdown && (
            <div className="location-dropdown">
              <p className="dropdown-title">Select your city</p>
              {popularLocations.map((loc) => (
                <button
                  key={loc}
                  className={`location-option ${loc === locationText ? 'active' : ''}`}
                  onClick={() => handleLocationSelect(loc)}
                >
                  <MapPin size={14} />
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="navbar-search" ref={searchRef}>
          <div className="search-input-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder='Search "milk, bread, eggs..."'
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
            {query && (
              <button className="search-clear" onClick={clearSearch}>
                <X size={16} />
              </button>
            )}
          </div>
          {/* Autocomplete suggestions */}
          {suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((product) => (
                <button
                  key={product.id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(product)}
                >
                  <Search size={14} />
                  <span>{product.name}</span>
                  <span className="suggestion-category">{product.category.replace(/-/g, ' ')}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          <Link to="/login" className="btn-login">
            <User size={18} />
            <span>Login</span>
          </Link>
          <Link to="/cart" className="btn-cart">
            <ShoppingCart size={20} />
            <span>Cart</span>
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-search-wrap">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search groceries..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {query && <button onClick={clearSearch}><X size={14} /></button>}
          </div>
          <div className="mobile-menu-links">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <User size={16} /> Login / Signup
            </Link>
            <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
              <ShoppingCart size={16} /> Cart ({itemCount})
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
