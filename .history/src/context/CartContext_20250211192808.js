import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});

  // 獲取指定餐廳的購物車
  const getCart = (restaurantId) => {
    return cartItems[restaurantId] || [];
  };

  // 添加商品到購物車（使用 uniqueId 區分）
  const addToCart = (restaurantId, item, quantity = 1) => {
    setCartItems((prevState) => {
      const restaurantCart = prevState[restaurantId] || [];
      // 使用 uniqueId 檢查是否已存在相同選項的商品
      const existingItemIndex = restaurantCart.findIndex(
        cartItem => cartItem.uniqueId === item.uniqueId // 改用 uniqueId
      );

      const updatedCart = [...restaurantCart];
      if (existingItemIndex >= 0) {
        // 如果存在相同 uniqueId 的商品，增加數量
        updatedCart[existingItemIndex].quantity += quantity;
      } else {
        // 否則添加新商品
        updatedCart.push({ ...item, quantity });
      }

      return {
        ...prevState,
        [restaurantId]: updatedCart,
      };
    });
  };

  // 從購物車移除商品（使用 uniqueId）
  const removeFromCart = (restaurantId, itemUniqueId) => { // 參數改為 itemUniqueId
    setCartItems((prevState) => {
      const updatedCart = getCart(restaurantId).filter(
        item => item.uniqueId !== itemUniqueId // 改用 uniqueId
      );
      return {
        ...prevState,
        [restaurantId]: updatedCart,
      };
    });
  };

  // 更新商品數量（使用 uniqueId）
  const updateQuantity = (restaurantId, itemUniqueId, quantity) => { // 參數改為 itemUniqueId
    setCartItems((prevState) => {
      const updatedCart = getCart(restaurantId).map(item =>
        item.uniqueId === itemUniqueId // 改用 uniqueId
          ? { ...item, quantity }
          : item
      );
      return {
        ...prevState,
        [restaurantId]: updatedCart,
      };
    });
  };

  // 其他方法保持不變...
  const clearCart = (restaurantId) => {
    setCartItems((prevState) => {
      const updatedCarts = { ...prevState };
      delete updatedCarts[restaurantId];
      return updatedCarts;
    });
  };

  const getTotalItems = (restaurantId) => {
    const cart = getCart(restaurantId);
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = (restaurantId) => {
    const cart = getCart(restaurantId);
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
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

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};