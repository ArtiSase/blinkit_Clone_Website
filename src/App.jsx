import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <CartProvider>
      <Router>
        <div className="app-wrapper">
          <Navbar
            onSearch={setSearchQuery}
            searchQuery={searchQuery}
          />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Home searchQuery={searchQuery} />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
          <Footer />
        </div>
        <Toaster />
      </Router>
    </CartProvider>
  );
}
