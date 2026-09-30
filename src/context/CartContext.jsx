import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  loadCart,
  saveCart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  getCartSubtotal,
  getCartMRP,
  getCartDiscount,
  getDeliveryFee,
  getCartItemCount,
  getGrandTotal,
} from '../utils/cartUtils';

const CartContext = createContext(null);

// Cart reducer handles all cart state transitions
function cartReducer(state, action) {
  let newCart;
  switch (action.type) {
    case 'ADD':
      newCart = addToCart(state.cart, action.product);
      break;
    case 'REMOVE':
      newCart = removeFromCart(state.cart, action.productId);
      break;
    case 'INCREASE':
      newCart = increaseQuantity(state.cart, action.productId);
      break;
    case 'DECREASE':
      newCart = decreaseQuantity(state.cart, action.productId);
      break;
    case 'CLEAR':
      newCart = clearCart();
      break;
    default:
      return state;
  }
  saveCart(newCart);
  return { cart: newCart };
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { cart: [] }, () => ({
    cart: loadCart(),
  }));

  const { cart } = state;

  // Derived values
  const subtotal = getCartSubtotal(cart);
  const mrpTotal = getCartMRP(cart);
  const discount = getCartDiscount(cart);
  const deliveryFee = getDeliveryFee(subtotal);
  const grandTotal = getGrandTotal(cart);
  const itemCount = getCartItemCount(cart);

  // Cart item quantity lookup (for ProductCard "ADD" vs qty controls)
  const getItemQty = (productId) => {
    const item = cart.find((i) => i.id === productId);
    return item ? item.cartQty : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        subtotal,
        mrpTotal,
        discount,
        deliveryFee,
        grandTotal,
        itemCount,
        getItemQty,
        addToCart: (product) => dispatch({ type: 'ADD', product }),
        removeFromCart: (productId) => dispatch({ type: 'REMOVE', productId }),
        increaseQuantity: (productId) => dispatch({ type: 'INCREASE', productId }),
        decreaseQuantity: (productId) => dispatch({ type: 'DECREASE', productId }),
        clearCart: () => dispatch({ type: 'CLEAR' }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
