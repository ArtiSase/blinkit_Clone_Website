import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Zap, Minus, Plus, Shield, Clock } from 'lucide-react';
import { getProductById, getRelatedProducts, categories } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id);
  const { getItemQty, addToCart, increaseQuantity, decreaseQuantity } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="not-found-page container">
        <h2>Product not found</h2>
        <Link to="/" className="btn-primary">Go back home</Link>
      </div>
    );
  }

  const cartQty = getItemQty(product.id);
  const related = getRelatedProducts(product);
  const categoryName = categories.find((c) => c.id === product.category)?.name || product.category;
  const savings = (product.mrp - product.price) * qty;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      style: { background: '#0c831f', color: '#fff', fontWeight: '600', borderRadius: '12px' },
      icon: '🛒',
    });
  };

  return (
    <div className="product-details-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <button onClick={() => navigate(-1)} className="back-btn">
            <ArrowLeft size={18} /> Back
          </button>
          <span>/</span>
          <Link to="/">{categoryName}</Link>
          <span>/</span>
          <span className="current">{product.name}</span>
        </nav>

        <div className="product-details-grid">
          {/* Left: Image */}
          <div className="product-details-img-wrap">
            {product.discount > 0 && (
              <span className="detail-discount-badge">{product.discount}% OFF</span>
            )}
            <img
              src={product.image}
              alt={product.name}
              className="product-details-img"
              onError={(e) => {
                e.target.src = 'https://placehold.co/400x400/f0fdf4/16a34a?text=Product';
              }}
            />
            <div className="delivery-promise">
              <Zap size={16} color="#0c831f" />
              <span>Delivery in <strong>10 minutes</strong></span>
            </div>
          </div>

          {/* Right: Info */}
          <div className="product-details-info">
            <span className="product-category-badge">{categoryName}</span>
            <h1 className="product-details-name">{product.name}</h1>
            <p className="product-details-qty">{product.quantity}</p>

            {/* Rating */}
            <div className="detail-rating">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={16}
                  fill={s <= Math.round(product.rating) ? '#fbbf24' : 'none'}
                  color={s <= Math.round(product.rating) ? '#fbbf24' : '#d1d5db'}
                />
              ))}
              <span className="rating-value">{product.rating}</span>
              <span className="rating-count">(142 ratings)</span>
            </div>

            {/* Price */}
            <div className="detail-price-block">
              <span className="detail-price">₹{product.price}</span>
              {product.mrp > product.price && (
                <>
                  <span className="detail-mrp">MRP ₹{product.mrp}</span>
                  <span className="detail-saving-tag">Save ₹{product.mrp - product.price}</span>
                </>
              )}
            </div>

            <p className="product-description">{product.description}</p>

            {/* Qty Selector for direct add */}
            <div className="detail-qty-row">
              <span className="detail-qty-label">Quantity:</span>
              <div className="detail-qty-controls">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty === 1}
                >
                  <Minus size={16} />
                </button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)}>
                  <Plus size={16} />
                </button>
              </div>
              {savings > 0 && <span className="qty-saving">You save ₹{savings}</span>}
            </div>

            {/* Cart Controls */}
            <div className="detail-cart-row">
              {cartQty === 0 ? (
                <button className="btn-add-detail" onClick={handleAddToCart}>
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
              ) : (
                <>
                  <div className="cart-qty-big">
                    <button onClick={() => decreaseQuantity(product.id)}><Minus size={18} /></button>
                    <span>{cartQty}</span>
                    <button onClick={() => increaseQuantity(product.id)}><Plus size={18} /></button>
                  </div>
                  <Link to="/cart" className="btn-go-cart">
                    <ShoppingCart size={18} /> View Cart
                  </Link>
                </>
              )}
            </div>

            {/* Trust badges */}
            <div className="trust-badges">
              <div className="trust-item"><Zap size={16} color="#0c831f" /><span>10 min delivery</span></div>
              <div className="trust-item"><Shield size={16} color="#0c831f" /><span>Quality assured</span></div>
              <div className="trust-item"><Clock size={16} color="#0c831f" /><span>24×7 available</span></div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="related-section">
            <h2 className="section-title">Related Products</h2>
            <div className="product-grid">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
