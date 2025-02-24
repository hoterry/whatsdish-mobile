import React, { createContext, useContext, useState } from 'react';

// 创建 CartContext
const CartContext = createContext();

// CartProvider 组件
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  console.log('CartProvider - cartItems DDD:', cartItems);

  const getCart = (restaurantId) => {
    const cart = cartItems[restaurantId] || [];
    console.log(`getCart - restaurantIdDDD: ${restaurantId}, cart:`, cart);
    return cart;
  };

  const addToCart = (restaurantId, item, quantity = 1) => {
    console.log(`addToCart - restaurantId: ${restaurantId}, item:`, item, 'quantity:', quantity);
    setCartItems((prevState) => {
      const restaurantCart = prevState[restaurantId] || [];
      const existingItemIndex = restaurantCart.findIndex(cartItem => cartItem.uniqueId === item.uniqueId);  // 修改为 uniqueId
      console.log('addToCart - existingItemIndex:', existingItemIndex);

      const updatedCart = [...restaurantCart];
      if (existingItemIndex >= 0) {
        updatedCart[existingItemIndex].quantity += quantity;
      } else {
        updatedCart.push({ ...item, quantity });
      }

      console.log('addToCart - updatedCart:', updatedCart);

      return {
        ...prevState,
        [restaurantId]: updatedCart,
      };
    });
  };

  const removeFromCart = (restaurantId, uniqueId) => {
    console.log(`removeFromCart - restaurantId: ${restaurantId}, uniqueId: ${uniqueId}`);
    setCartItems((prevState) => {
      const updatedCart = getCart(restaurantId).filter(item => item.uniqueId !== uniqueId);  // 修改为 uniqueId
      console.log('removeFromCart - updatedCart:', updatedCart);

      return {
        ...prevState,
        [restaurantId]: updatedCart,
      };
    });
  };

  const updateQuantity = (restaurantId, uniqueId, quantity) => {
    console.log(`updateQuantity - restaurantId: ${restaurantId}, uniqueId: ${uniqueId}, quantity: ${quantity}`);
    setCartItems((prevState) => {
      const updatedCart = getCart(restaurantId).map(item =>
        item.uniqueId === uniqueId ? { ...item, quantity } : item  // 修改为 uniqueId
      );
      console.log('updateQuantity - updatedCart:', updatedCart);

      return {
        ...prevState,
        [restaurantId]: updatedCart,
      };
    });
  };

  const clearCart = (restaurantId) => {
    console.log(`clearCart - restaurantId: ${restaurantId}`);
    setCartItems((prevState) => {
      const updatedCarts = { ...prevState };
      delete updatedCarts[restaurantId];
      console.log('clearCart - updatedCarts:', updatedCarts);
      return updatedCarts;
    });
  };

  const getTotalItems = (restaurantId) => {
    const cart = getCart(restaurantId);  // 保证是数组
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    console.log(`getTotalItems - restaurantId: ${restaurantId}, total: ${total}`);
    return total;
  };

  const getTotalPrice = (restaurantId) => {
    const cart = getCart(restaurantId);  // 保证是数组
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    console.log(`getTotalPrice - restaurantId: ${restaurantId}, totalPrice: ${totalPrice}`);
    return totalPrice;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// CartContext.js
export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};
