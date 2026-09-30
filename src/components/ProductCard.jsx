import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { getItemQty, addToCart, increaseQuantity, decreaseQuantity } = useCart();
  const qty = getItemQty(product.id);

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      duration: 1800,
      position: 'bottom-center',
      style: {
        background: '#0c831f',
        color: '#fff',
        fontWeight: '600',
        borderRadius: '12px',
        fontSize: '14px',
      },
      icon: '🛒',
    });
  };

  const handleIncrease = (e) => {
    e.preventDefault();
    increaseQuantity(product.id);
  };

  const handleDecrease = (e) => {
    e.preventDefault();
    decreaseQuantity(product.id);
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      {/* Discount Badge */}
      {product.discount > 0 && (
        <span className="discount-badge">{product.discount}% OFF</span>
      )}

      {/* Image */}
      <div className="product-img-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://placehold.co/200x200/f0fdf4/16a34a?text=Grocery';
          }}
        />
      </div>

      {/* Details */}
      <div className="product-info">
        {/* Delivery time */}
        <span className="delivery-time">🕒 10 min</span>

        <p className="product-name">{product.name}</p>
        <p className="product-qty">{product.quantity}</p>

        {/* Rating */}
        <div className="product-rating">
          <Star size={12} fill="#fbbf24" color="#fbbf24" />
          <span>{product.rating}</span>
        </div>

        {/* Price row */}
        <div className="product-price-row">
          <div className="price-group">
            <span className="product-price">₹{product.price}</span>
            {product.mrp > product.price && (
              <span className="product-mrp">₹{product.mrp}</span>
            )}
          </div>

          {/* Add / Quantity control */}
          {qty === 0 ? (
            <button className="btn-add" onClick={handleAdd}>
              <Plus size={16} />
              ADD
            </button>
          ) : (
            <div className="qty-controls">
              <button className="qty-btn" onClick={handleDecrease}>
                <Minus size={14} />
              </button>
              <span className="qty-count">{qty}</span>
              <button className="qty-btn" onClick={handleIncrease}>
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
