import React, { createContext, useContext, useState } from 'react';

// 创建 CartContext
const CartContext = createContext();

// CartProvider 组件
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});

  // 获取指定餐厅的购物车
  const getCart = (restaurantId) => {
    return cartItems[restaurantId] || [];
  };

  // 添加商品到购物车
  const addToCart = (restaurantId, item, quantity = 1) => {
    setCartItems((prevState) => {
      const restaurantCart = prevState[restaurantId] || [];
      const existingItemIndex = restaurantCart.findIndex(cartItem => cartItem.uniqueId === item.uniqueId);

      const updatedCart = [...restaurantCart];
      if (existingItemIndex >= 0) {
        updatedCart[existingItemIndex].quantity += quantity;
      } else {
        updatedCart.push({ ...item, quantity });
      }

      return {
        ...prevState,
        [restaurantId]: updatedCart,
      };
    });
  };

  // 从购物车中移除商品
  const removeFromCart = (restaurantId, uniqueId) => {
    setCartItems((prevState) => {
      const updatedCart = getCart(restaurantId).filter(item => item.uniqueId !== uniqueId);
      return {
        ...prevState,
        [restaurantId]: updatedCart,
      };
    });
  };

  // 更新商品数量
  const updateQuantity = (restaurantId, uniqueId, quantity) => {
    setCartItems((prevState) => {
      const updatedCart = getCart(restaurantId).map(item =>
        item.uniqueId === uniqueId ? { ...item, quantity } : item
      );
      return {
        ...prevState,
        [restaurantId]: updatedCart,
      };
    });
  };

  // 清空指定餐厅的购物车
  const clearCart = (restaurantId) => {
    setCartItems((prevState) => {
      const updatedCarts = { ...prevState };
      delete updatedCarts[restaurantId];
      return updatedCarts;
    });
  };

  // 获取购物车中的商品数量
  const getTotalItems = (restaurantId) => {
    const cart = getCart(restaurantId);
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  // 获取购物车中商品的总价格
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

// 自定义 hook 用于使用 CartContext
export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};
