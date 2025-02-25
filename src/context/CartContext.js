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
    if (__DEV__) {
      console.log("[CartContext Log] Received restaurantId in addToCart :", restaurantId);
    }
  
    if (!item) {
      console.error("[CartContext ERROR] addToCart received an undefined item!");
      return;
    }
  
    if (!item.uniqueId) {
      console.error("[CartContext ERROR] item is missing a uniqueId:", item);
      return;
    }
  
    const safeModifiers = item.selectedModifiers || [];
    const safeOption = item.selectedOption || null;
  
    setCartItems((prevState) => {
      const restaurantCart = prevState[restaurantId] || [];
      const existingItemIndex = restaurantCart.findIndex(cartItem => cartItem.uniqueId === item.uniqueId);
  
      const updatedCart = [...restaurantCart];
      if (existingItemIndex >= 0) {
        updatedCart[existingItemIndex].quantity += quantity;
        updatedCart[existingItemIndex].selectedModifiers = safeModifiers;
        updatedCart[existingItemIndex].selectedOption = safeOption;
      } else {
        updatedCart.push({ ...item, quantity, selectedModifiers: safeModifiers, selectedOption: safeOption });
      }
  
      return {
        ...prevState,
        [restaurantId]: updatedCart,
      };
    });
  };
  
  

  const removeFromCart = (restaurantId, uniqueId) => {
    if (__DEV__) {
      console.log("[CartContext Log] Removing item with uniqueId:", uniqueId, "from restaurantId:", restaurantId);
    }

    setCartItems((prevState) => {
      const updatedCart = getCart(restaurantId).filter(item => item.uniqueId !== uniqueId);
      return {
        ...prevState,
        [restaurantId]: updatedCart,
      };
    });
  };

  const updateQuantity = (restaurantId, uniqueId, quantity) => {
    if (__DEV__) {
      console.log("[CartContext Log] Updating quantity for uniqueId:", uniqueId, "to:", quantity);
    }

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
    if (__DEV__) {
      console.log("[CartContext Log] Clearing cart for restaurantId:", restaurantId);
    }

    setCartItems((prevState) => {
      const updatedCarts = { ...prevState };
      delete updatedCarts[restaurantId];
      return updatedCarts;
    });
  };

  const getTotalItems = (restaurantId) => {
    const cart = getCart(restaurantId);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (__DEV__) {
      console.log("[CartContext Log] Total items in cart for restaurantId:", restaurantId, "is:", totalItems);
    }

    return totalItems;
  };

  const getTotalPrice = (restaurantId) => {
    const cart = getCart(restaurantId);
    const totalPrice = cart.reduce((total, item) => {
      const basePrice = item.price || 0; 
      const itemTotal = basePrice * item.quantity; 
      
      if (isNaN(itemTotal)) {
        console.warn('Invalid price calculation for item:', item);
        return total;
      }
      return total + itemTotal;
    }, 0);

    if (__DEV__) {
      console.log("[CartContext Log] Total price for cart in restaurantId:", restaurantId, "is:", totalPrice);
    }

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

// useCart custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
