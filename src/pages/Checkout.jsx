import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, CreditCard, Smartphone, Banknote, ChevronRight, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { generateOrderId } from '../utils/cartUtils';

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when your order arrives' },
  { id: 'upi', label: 'UPI Payment', icon: Smartphone, desc: 'GPay, PhonePe, Paytm, etc.' },
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
];

const INITIAL_ADDRESS = {
  name: '',
  mobile: '',
  flat: '',
  area: '',
  city: '',
  pincode: '',
};

export default function Checkout() {
  const { cart, subtotal, discount, deliveryFee, grandTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState(INITIAL_ADDRESS);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  const validate = () => {
    const errs = {};
    if (!address.name.trim()) errs.name = 'Name is required';
    if (!/^[6-9]\d{9}$/.test(address.mobile)) errs.mobile = 'Enter a valid 10-digit mobile number';
    if (!address.flat.trim()) errs.flat = 'Flat/House number is required';
    if (!address.area.trim()) errs.area = 'Area is required';
    if (!address.city.trim()) errs.city = 'City is required';
    if (!/^\d{6}$/.test(address.pincode)) errs.pincode = 'Enter a valid 6-digit pincode';
    return errs;
  };

  const handleChange = (field) => (e) => {
    setAddress((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handlePlaceOrder = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      document.getElementById('checkout-form').scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setPlacing(true);
    const orderId = generateOrderId();
    // Store order info in sessionStorage for success page
    sessionStorage.setItem('lastOrder', JSON.stringify({ orderId, address, cart, grandTotal, paymentMethod }));
    setTimeout(() => {
      clearCart();
      navigate('/order-success');
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="container not-found-page">
        <h2>No items in cart</h2>
        <Link to="/" className="btn-primary">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>
        <div className="checkout-grid">
          {/* Left: Form */}
          <div id="checkout-form">
            {/* Delivery Address */}
            <section className="checkout-section">
              <h2 className="checkout-section-title">
                <MapPin size={20} color="#0c831f" /> Delivery Address
              </h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={address.name}
                    onChange={handleChange('name')}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={address.mobile}
                    onChange={handleChange('mobile')}
                    maxLength={10}
                    className={errors.mobile ? 'error' : ''}
                  />
                  {errors.mobile && <span className="form-error">{errors.mobile}</span>}
                </div>
                <div className="form-group full-width">
                  <label>House / Flat / Building *</label>
                  <input
                    type="text"
                    placeholder="House No., Flat, Building name"
                    value={address.flat}
                    onChange={handleChange('flat')}
                    className={errors.flat ? 'error' : ''}
                  />
                  {errors.flat && <span className="form-error">{errors.flat}</span>}
                </div>
                <div className="form-group full-width">
                  <label>Area / Street / Locality *</label>
                  <input
                    type="text"
                    placeholder="Colony, Street, Area"
                    value={address.area}
                    onChange={handleChange('area')}
                    className={errors.area ? 'error' : ''}
                  />
                  {errors.area && <span className="form-error">{errors.area}</span>}
                </div>
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    placeholder="City"
                    value={address.city}
                    onChange={handleChange('city')}
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="form-error">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    placeholder="6-digit pincode"
                    value={address.pincode}
                    onChange={handleChange('pincode')}
                    maxLength={6}
                    className={errors.pincode ? 'error' : ''}
                  />
                  {errors.pincode && <span className="form-error">{errors.pincode}</span>}
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="checkout-section">
              <h2 className="checkout-section-title">
                <CreditCard size={20} color="#0c831f" /> Payment Method
              </h2>
              <div className="payment-options">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  return (
                    <label
                      key={method.id}
                      className={`payment-option ${paymentMethod === method.id ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                      />
                      <Icon size={22} className="payment-icon" />
                      <div>
                        <strong>{method.label}</strong>
                        <p>{method.desc}</p>
                      </div>
                      {paymentMethod === method.id && <CheckCircle size={18} className="payment-check" />}
                    </label>
                  );
                })}
              </div>
              {paymentMethod === 'upi' && (
                <div className="upi-demo">
                  <input type="text" placeholder="Enter UPI ID (e.g. name@upi)" className="upi-input" />
                  <p className="demo-note">⚠️ Demo only — no actual payment will be processed</p>
                </div>
              )}
              {paymentMethod === 'card' && (
                <div className="card-demo">
                  <input type="text" placeholder="Card Number" className="upi-input" maxLength={19} />
                  <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                    <input type="text" placeholder="MM / YY" className="upi-input" maxLength={5} />
                    <input type="text" placeholder="CVV" className="upi-input" maxLength={3} />
                  </div>
                  <p className="demo-note">⚠️ Demo only — no actual payment will be processed</p>
                </div>
              )}
            </section>
          </div>

          {/* Right: Summary */}
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <div className="checkout-items">
              {cart.map((item) => (
                <div key={item.id} className="checkout-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => { e.target.src = 'https://placehold.co/48x48/f0fdf4/16a34a?text=Item'; }}
                  />
                  <div>
                    <p>{item.name}</p>
                    <span>×{item.cartQty}</span>
                  </div>
                  <strong>₹{item.price * item.cartQty}</strong>
                </div>
              ))}
            </div>

            <div className="checkout-totals">
              <div className="total-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
              {discount > 0 && (
                <div className="total-row green"><span>Discount</span><span>−₹{discount}</span></div>
              )}
              <div className="total-row"><span>Delivery Fee</span><span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
              <div className="total-row grand"><span>Grand Total</span><span>₹{grandTotal}</span></div>
            </div>

            <button
              className="btn-place-order"
              onClick={handlePlaceOrder}
              disabled={placing}
            >
              {placing ? (
                <span className="placing-spinner">Placing order...</span>
              ) : (
                <>Place Order <ChevronRight size={18} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
