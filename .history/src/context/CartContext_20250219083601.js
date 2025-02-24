import React, { createContext, useContext, useState } from 'react';

// Create CartContext
const CartContext = createContext();

// CartProvider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});

  const getCart = (restaurantId) => {
    return cartItems[restaurantId] || [];
  };

  const addToCart = (restaurantId, item, quantity = 1) => {
    console.log("📌 Received restaurantId in addToCart:", restaurantId); 
    setCartItems((prevState) => {
      const restaurantCart = prevState[restaurantId] || [];
      const existingItemIndex = restaurantCart.findIndex(cartItem => cartItem.uniqueId === item.uniqueId);
  
      const updatedCart = [...restaurantCart];
      if (existingItemIndex >= 0) {
        updatedCart[existingItemIndex].quantity += quantity;
        updatedCart[existingItemIndex].selectedModifiers = item.selectedModifiers;
        updatedCart[existingItemIndex].selectedOption = item.selectedOption;
      } else {
        updatedCart.push({ ...item, quantity });
      }
  
      return {
        ...prevState,
        [restaurantId]: updatedCart,
      };
    });
  };
  

  const removeFromCart = (restaurantId, uniqueId) => {
    setCartItems((prevState) => {
      const updatedCart = getCart(restaurantId).filter(item => item.uniqueId !== uniqueId);
      return {
        ...prevState,
        [restaurantId]: updatedCart,
      };
    });
  };

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
    return cart.reduce((total, item) => {
      const basePrice = item.price || 0; // 如果價格無效，設為 0
      const optionPrice = item.selectedOption?.price || 0; // 處理 selectedOption 的價格
      const modifiersPrice = item.selectedModifiers?.reduce((sum, modifier) => sum + (modifier.price || 0), 0) || 0; // 處理 modifiers 的價格
      
      const itemTotal = (basePrice + optionPrice + modifiersPrice) * item.quantity;
      
      // 確保 itemTotal 是有效數字
      if (isNaN(itemTotal)) {
        console.warn('Invalid price calculation for item:', item);
        return total; // 返回不加任何金額
      }
      return total + itemTotal; // 加上有效的 itemTotal
    }, 0);
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

// useCart custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
