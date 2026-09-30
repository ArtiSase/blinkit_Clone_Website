import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item">
      <img
        src={item.image}
        alt={item.name}
        className="cart-item-img"
        onError={(e) => {
          e.target.src = 'https://placehold.co/80x80/f0fdf4/16a34a?text=Item';
        }}
      />
      <div className="cart-item-info">
        <p className="cart-item-name">{item.name}</p>
        <p className="cart-item-qty">{item.quantity}</p>
        <p className="cart-item-price">₹{item.price} × {item.cartQty}</p>
      </div>
      <div className="cart-item-right">
        <div className="cart-qty-controls">
          <button
            className="cart-qty-btn"
            onClick={() => decreaseQuantity(item.id)}
          >
            <Minus size={14} />
          </button>
          <span className="cart-qty-count">{item.cartQty}</span>
          <button
            className="cart-qty-btn"
            onClick={() => increaseQuantity(item.id)}
          >
            <Plus size={14} />
          </button>
        </div>
        <p className="cart-item-subtotal">₹{(item.price * item.cartQty)}</p>
        <button
          className="cart-remove-btn"
          onClick={() => removeFromCart(item.id)}
          title="Remove item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
