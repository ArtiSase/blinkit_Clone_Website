// Cart utility functions
// All cart operations use localStorage for persistence

const CART_KEY = 'blinkit_cart';

// Load cart from localStorage
export const loadCart = () => {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Save cart to localStorage
export const saveCart = (cart) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    // silently fail if localStorage is unavailable
  }
};

// Add product to cart (or increase quantity if already present)
export const addToCart = (cart, product) => {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    return cart.map((item) =>
      item.id === product.id ? { ...item, cartQty: item.cartQty + 1 } : item
    );
  }
  return [...cart, { ...product, cartQty: 1 }];
};

// Remove product from cart completely
export const removeFromCart = (cart, productId) =>
  cart.filter((item) => item.id !== productId);

// Increase quantity of a product in cart
export const increaseQuantity = (cart, productId) =>
  cart.map((item) =>
    item.id === productId ? { ...item, cartQty: item.cartQty + 1 } : item
  );

// Decrease quantity; removes item if qty reaches 0
export const decreaseQuantity = (cart, productId) => {
  const item = cart.find((i) => i.id === productId);
  if (!item) return cart;
  if (item.cartQty <= 1) return removeFromCart(cart, productId);
  return cart.map((i) =>
    i.id === productId ? { ...i, cartQty: i.cartQty - 1 } : i
  );
};

// Clear all items from cart
export const clearCart = () => [];

// Calculate subtotal (sum of price × qty for all items)
export const getCartSubtotal = (cart) =>
  cart.reduce((sum, item) => sum + item.price * item.cartQty, 0);

// Calculate total MRP (for discount display)
export const getCartMRP = (cart) =>
  cart.reduce((sum, item) => sum + item.mrp * item.cartQty, 0);

// Calculate total discount
export const getCartDiscount = (cart) => getCartMRP(cart) - getCartSubtotal(cart);

// Delivery fee logic
export const getDeliveryFee = (subtotal) => {
  if (subtotal === 0) return 0;
  if (subtotal >= 299) return 0; // free delivery above ₹299
  return 25;
};

// Get total item count
export const getCartItemCount = (cart) =>
  cart.reduce((sum, item) => sum + item.cartQty, 0);

// Get grand total
export const getGrandTotal = (cart) => {
  const subtotal = getCartSubtotal(cart);
  return subtotal + getDeliveryFee(subtotal);
};

// Generate a random order ID
export const generateOrderId = () => {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BLK-${ts}-${rand}`;
};
