import React, { createContext, useContext, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});

  const syncCartToContext = (restaurantId, fetchedCartItems) => {
    setCartItems((prevState) => {
      const updatedCart = fetchedCartItems.map((item) => {
        const uniqueId = item.uniqueId || `${restaurantId}-${item.item_id || item.id}`;
        return {
          ...item,
          uniqueId,
          name: item.name || 'Unnamed Item',
          price: item.price || 0,
          quantity: item.quantity || item.count || 1,
          image_url: item.image_url || '',
          selectedModifiers: item.modifications?.map(mod => ({
            mod_id: mod.mod_id || mod.id,
            mod_group_id: mod.mod_group_id || mod.groupId,
            name: mod.name || '',
            price: mod.price || 0, 
            count: mod.count || 1,
          })) || [], 
          selectedOption: null,
        };
      });
      return { ...prevState, [restaurantId]: updatedCart };
    });
  };
  

  const getCart = (restaurantId) => cartItems[restaurantId] || [];

  const syncCartToDatabase = async (item, quantity, mode) => {
    try {
      console.log(`[CartContext Log] Sync Start - Mode: ${mode}`, { item, quantity });
  
      const order_id = await SecureStore.getItemAsync('order_id');
      const accountId = await SecureStore.getItemAsync('accountId');
  
      if (!order_id || !accountId) {
        console.error("[CartContext ERROR] Missing order_id or accountId in SecureStore");
        return;
      }
  
      const payload = {
        item_id: item.item_id || item.id, // Ensure item_id is included
        gid: item.gid,
        order_id,
        sub: accountId,
        count: quantity,
        note: item.note || '',
        modifications: item.selectedModifiers?.map((modifier) => ({
          mod_id: modifier.mod_id,
          mod_group_id: modifier.mod_group_id,
          count: modifier.count || 1,
        })) || [],
      };
  
      console.log("[CartContext Log] Payload:", JSON.stringify(payload, null, 2));
  
      const url = `https://dev.whatsdish.com/api/orders/${order_id}/items/set?mode=${mode}`;
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to sync cart');
      }
  
      console.log("[CartContext Log] API Response:", data);
    } catch (error) {
      console.error("[CartContext ERROR] Failed to sync cart to database:", error);
    }
  };
  
  const addToCart = async (restaurantId, item, quantity = 1) => {
    console.log("[CartContext Log] addToCart called with:", { restaurantId, item, quantity });
  
    if (!item || !item.uniqueId) {
      console.error("[CartContext ERROR] Invalid item:", item);
      return;
    }
  
    const safeModifiers = (item.selectedModifiers || []).map(modifier => ({
      mod_id: modifier.mod_id || modifier.id,
      mod_group_id: modifier.mod_group_id || modifier.groupId,
      name: modifier.name || '', 
      price: modifier.price || 0, 
      count: modifier.count || 1,
    }));
  
    setCartItems((prevState) => {
      const restaurantCart = prevState[restaurantId] || [];
      const existingItemIndex = restaurantCart.findIndex(cartItem => cartItem.uniqueId === item.uniqueId);
      const updatedCart = [...restaurantCart];
  
      if (existingItemIndex >= 0) {
        updatedCart[existingItemIndex].quantity += quantity;
        updatedCart[existingItemIndex].selectedModifiers = safeModifiers;
      } else {
        updatedCart.push({ ...item, quantity, selectedModifiers: safeModifiers });
      }
  
      return { ...prevState, [restaurantId]: updatedCart };
    });
  
    // 確保狀態更新完成後再進行其他操作
    await new Promise((resolve) => setTimeout(resolve, 0)); // 等待狀態更新
  
    // 明確傳遞 mode 參數
    await syncCartToDatabase(item, quantity, 'ADD');
  };
  const removeFromCart = (restaurantId, uniqueId) => {
    console.log("[CartContext Log] removeFromCart called with:", { restaurantId, uniqueId });

    setCartItems((prevState) => {
      const updatedCart = getCart(restaurantId).filter(item => item.uniqueId !== uniqueId);
      const removedItem = getCart(restaurantId).find(item => item.uniqueId === uniqueId);

      if (removedItem) {
        syncCartToDatabase(removedItem, removedItem.quantity, 'SUBTRACT');
      }

      return { ...prevState, [restaurantId]: updatedCart };
    });
  };

  const updateQuantity = (restaurantId, uniqueId, quantity) => {
    console.log("[CartContext Log] updateQuantity called with:", { restaurantId, uniqueId, quantity });

    setCartItems((prevState) => {
      const updatedCart = getCart(restaurantId).map((item) => {
        if (item.uniqueId === uniqueId) {
          syncCartToDatabase(item, quantity, quantity > item.quantity ? 'ADD' : 'SUBTRACT');
          return { ...item, quantity };
        }
        return item;
      });

      return { ...prevState, [restaurantId]: updatedCart };
    });
  };

  const clearCart = (restaurantId) => {
    console.log("[CartContext Log] clearCart called for restaurantId:", restaurantId);

    setCartItems((prevState) => {
      const updatedCarts = { ...prevState };
      delete updatedCarts[restaurantId];
      return updatedCarts;
    });
  };

  const getTotalItems = (restaurantId) => {
    const restaurantCart = cartItems[restaurantId] || [];
    const totalItems = restaurantCart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    console.log("[CartContext Log] getTotalItems result:", totalItems);
    return totalItems;
  };

  const getTotalPrice = (restaurantId) => {
    const restaurantCart = cartItems[restaurantId] || [];
    const totalPrice = restaurantCart.reduce(
      (total, item) => total + (item.price || 0) * item.quantity,
      0
    );
    console.log("[CartContext Log] getTotalPrice result:", totalPrice);
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
        syncCartToContext,
        setCartItems 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};