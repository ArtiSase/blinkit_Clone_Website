import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, Tag } from 'lucide-react';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, subtotal, mrpTotal, discount, deliveryFee, grandTotal, itemCount, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="empty-cart-page container">
        <div className="empty-cart-content">
          <ShoppingBag size={96} className="empty-cart-icon" />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet. Start adding fresh groceries!</p>
          <Link to="/" className="btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart <span className="cart-count-badge">{itemCount} items</span></h1>
          <button className="clear-cart-btn" onClick={clearCart}>
            <Trash2 size={16} /> Clear Cart
          </button>
        </div>

        <div className="cart-grid">
          {/* Cart Items */}
          <div className="cart-items-col">
            {/* Delivery promise */}
            <div className="delivery-info-bar">
              <span>🕒 Estimated delivery: <strong>10 – 20 minutes</strong></span>
            </div>

            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <h3 className="summary-title">Order Summary</h3>

            {deliveryFee === 0 && subtotal > 0 && (
              <div className="free-delivery-banner">
                <Tag size={14} /> Free delivery applied! 🎉
              </div>
            )}
            {deliveryFee > 0 && (
              <div className="delivery-upsell">
                Add ₹{299 - subtotal} more for <strong>FREE delivery</strong>
                <div className="delivery-progress">
                  <div
                    className="delivery-progress-fill"
                    style={{ width: `${Math.min((subtotal / 299) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="summary-rows">
              <div className="summary-row">
                <span>MRP Total</span>
                <span>₹{mrpTotal}</span>
              </div>
              <div className="summary-row green">
                <span>Product Discount</span>
                <span>− ₹{discount}</span>
              </div>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span className={deliveryFee === 0 ? 'green' : ''}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
            </div>

            <div className="summary-total">
              <span>Grand Total</span>
              <span>₹{grandTotal}</span>
            </div>

            {discount > 0 && (
              <div className="you-saved">
                🎉 You're saving ₹{discount} on this order!
              </div>
            )}

            <button
              className="btn-checkout"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
            <Link to="/" className="continue-shopping">← Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
