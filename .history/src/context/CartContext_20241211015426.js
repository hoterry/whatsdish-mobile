import React, { createContext, useContext, useState } from 'react';

// 创建 CartContext
const CartContext = createContext();

// CartProvider 组件
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  console.log('CartProvider - cartItems DDD:', cartItems); // 输出购物车内容

  const getCart = (restaurantId) => {
    const cart = cartItems[restaurantId] || [];
    console.log(`getCart - restaurantIdDDD: ${restaurantId}, cart:`); // 输出获取的餐厅购物车
    return cart;
  };

  const addToCart = (restaurantId, item, quantity = 1) => {
    console.log(`addToCart - restaurantId: ${restaurantId}, item:`, item, 'quantity:', quantity); // 输出添加商品的信息
    setCartItems((prevState) => {
      const restaurantCart = prevState[restaurantId] || [];
      const existingItemIndex = restaurantCart.findIndex(cartItem => cartItem.id === item.id);
      console.log('addToCart - existingItemIndex:', existingItemIndex); // 输出商品在购物车中的位置

      const updatedCart = [...restaurantCart];
      if (existingItemIndex >= 0) {
        updatedCart[existingItemIndex].quantity += quantity;
      } else {
        updatedCart.push({ ...item, quantity });
      }

      console.log('addToCart - updatedCart:', updatedCart); // 输出更新后的购物车

      return {
        ...prevState,
        [restaurantId]: updatedCart,
      };
    });
  };

  const removeFromCart = (restaurantId, itemId) => {
    console.log(`removeFromCart - restaurantId: ${restaurantId}, itemId: ${itemId}`); // 输出删除商品的信息
    setCartItems((prevState) => {
      const updatedCart = getCart(restaurantId).filter(item => item.id !== itemId);
      console.log('removeFromCart - updatedCart:', updatedCart); // 输出删除后的购物车

      return {
        ...prevState,
        [restaurantId]: updatedCart,
      };
    });
  };

  const updateQuantity = (restaurantId, itemId, quantity) => {
    console.log(`updateQuantity - restaurantId: ${restaurantId}, itemId: ${itemId}, quantity: ${quantity}`); // 输出更新数量的信息
    setCartItems((prevState) => {
      const updatedCart = getCart(restaurantId).map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      console.log('updateQuantity - updatedCart:', updatedCart); // 输出更新后的购物车

      return {
        ...prevState,
        [restaurantId]: updatedCart,
      };
    });
  };

  const clearCart = (restaurantId) => {
    console.log(`clearCart - restaurantId: ${restaurantId}`); // 输出清空购物车的信息
    setCartItems((prevState) => {
      const updatedCarts = { ...prevState };
      delete updatedCarts[restaurantId];
      console.log('clearCart - updatedCarts:', updatedCarts); // 输出清空后的购物车
      return updatedCarts;
    });
  };

  const getTotalItems = (restaurantId) => {
    const cart = getCart(restaurantId);  // 保证是数组
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    console.log(`getTotalItems - restaurantId: ${restaurantId}, total: ${total}`); // 输出商品总数
    return total;
  };

  const getTotalPrice = (restaurantId) => {
    const cart = getCart(restaurantId);  // 保证是数组
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    console.log(`getTotalPrice - restaurantId: ${restaurantId}, totalPrice: ${totalPrice}`); // 输出购物车总价
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

  // 检查 CartContext 是否正确传递和获取
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};
