import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, MapPin, Package, ShoppingBag } from 'lucide-react';
import Confetti from '../components/Confetti';

export default function OrderSuccess() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('lastOrder');
    if (stored) {
      setOrder(JSON.parse(stored));
      sessionStorage.removeItem('lastOrder');
    }
  }, []);

  if (!order) {
    return (
      <div className="container not-found-page">
        <h2>No order found</h2>
        <Link to="/" className="btn-primary">Shop Now</Link>
      </div>
    );
  }

  const { orderId, address, cart, grandTotal, paymentMethod } = order;
  const payLabels = { cod: 'Cash on Delivery', upi: 'UPI Payment', card: 'Card Payment' };

  return (
    <div className="order-success-page">
      <Confetti />
      <div className="container">
        <div className="success-card">
          {/* Success header */}
          <div className="success-header">
            <div className="success-icon-wrap">
              <CheckCircle size={64} color="white" />
            </div>
            <h1>Order Placed Successfully! 🎉</h1>
            <p>Your groceries are being packed and will arrive soon</p>
          </div>

          {/* Order meta */}
          <div className="order-meta-grid">
            <div className="meta-card">
              <Package size={24} color="#0c831f" />
              <div>
                <p className="meta-label">Order ID</p>
                <p className="meta-value">{orderId}</p>
              </div>
            </div>
            <div className="meta-card">
              <Clock size={24} color="#0c831f" />
              <div>
                <p className="meta-label">Estimated Arrival</p>
                <p className="meta-value">10 – 20 minutes</p>
              </div>
            </div>
            <div className="meta-card">
              <MapPin size={24} color="#0c831f" />
              <div>
                <p className="meta-label">Deliver to</p>
                <p className="meta-value">
                  {address.flat}, {address.area}, {address.city} – {address.pincode}
                </p>
              </div>
            </div>
            <div className="meta-card">
              <ShoppingBag size={24} color="#0c831f" />
              <div>
                <p className="meta-label">Payment</p>
                <p className="meta-value">{payLabels[paymentMethod] || paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Delivery tracker */}
          <div className="delivery-tracker">
            <div className="tracker-step done">
              <div className="tracker-dot" />
              <p>Order Placed</p>
            </div>
            <div className="tracker-line active" />
            <div className="tracker-step active">
              <div className="tracker-dot" />
              <p>Packing</p>
            </div>
            <div className="tracker-line" />
            <div className="tracker-step">
              <div className="tracker-dot" />
              <p>Out for Delivery</p>
            </div>
            <div className="tracker-line" />
            <div className="tracker-step">
              <div className="tracker-dot" />
              <p>Delivered</p>
            </div>
          </div>

          {/* Order items */}
          <div className="success-items">
            <h3>Your Order ({cart.length} items)</h3>
            {cart.map((item) => (
              <div key={item.id} className="success-item">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => { e.target.src = 'https://placehold.co/56x56/f0fdf4/16a34a?text=Item'; }}
                />
                <div>
                  <p>{item.name}</p>
                  <span>{item.quantity} × {item.cartQty}</span>
                </div>
                <strong>₹{item.price * item.cartQty}</strong>
              </div>
            ))}
            <div className="success-total">
              <span>Total Paid</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>

          <Link to="/" className="btn-continue">
            Continue Shopping →
          </Link>
        </div>
      </div>
    </div>
  );
}
