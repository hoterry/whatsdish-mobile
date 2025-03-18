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
  
      // For SUBTRACT mode, ensure we're sending a positive count to subtract
      if (mode === 'SUBTRACT' && quantity <= 0) {
        console.error("[CartContext ERROR] Quantity must be positive for SUBTRACT");
        return;
      }
  
      const payload = {
        item_id: item.item_id || item.id,
        gid: item.gid,
        order_id,
        sub: accountId,
        count: quantity, // This is the amount to subtract in SUBTRACT mode
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
      return data;
    } catch (error) {
      console.error("[CartContext ERROR] Failed to sync cart to database:", error);
      throw error;
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
        // If the item already exists, update its quantity and modifiers
        updatedCart[existingItemIndex].quantity += quantity;
        updatedCart[existingItemIndex].selectedModifiers = safeModifiers;
        // Sync the update to the database
        syncCartToDatabase(updatedCart[existingItemIndex], updatedCart[existingItemIndex].quantity, 'ADD');
      } else {
        // If it's a new item, add it to the cart
        updatedCart.push({ ...item, quantity, selectedModifiers: safeModifiers });
        // Sync the new item to the database
        syncCartToDatabase(item, quantity, 'ADD');
      }
  
      return { ...prevState, [restaurantId]: updatedCart };
    });
  
    // Ensure state is updated before continuing
    await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for state update
  };
  


  const removeFromCart = (restaurantId, uniqueId) => {
    console.log("[CartContext Log] removeFromCart called with:", { restaurantId, uniqueId });
  
    setCartItems((prevState) => {
      const currentCart = getCart(restaurantId);
      const removedItem = currentCart.find(item => item.uniqueId === uniqueId);
  
      if (removedItem) {
        // If the item is found, sync it to the database with 'SUBTRACT' mode
        // Pass the full quantity to subtract all instances of this item
        syncCartToDatabase(removedItem, removedItem.quantity, 'SUBTRACT')
          .then(response => {
            console.log("[CartContext Log] Item successfully removed:", response);
          })
          .catch(error => {
            console.error("[CartContext ERROR] Failed to remove item:", error);
          });
      } else {
        console.error("[CartContext ERROR] Item not found for removal:", uniqueId);
      }
  
      // Remove from local state regardless of API success
      const updatedCart = currentCart.filter(item => item.uniqueId !== uniqueId);
      return { ...prevState, [restaurantId]: updatedCart };
    });
  };
  


  
  const updateQuantity = (restaurantId, uniqueId, quantity) => {
    console.log("[CartContext Log] updateQuantity called with:", { restaurantId, uniqueId, quantity });
  
    setCartItems((prevState) => {
      const currentCart = getCart(restaurantId);
      const existingItem = currentCart.find(item => item.uniqueId === uniqueId);
      
      if (!existingItem) {
        console.error("[CartContext ERROR] Item not found in cart:", uniqueId);
        return prevState;
      }
  
      // Calculate the difference in quantity
      const currentQuantity = existingItem.quantity;
      const quantityDifference = Math.abs(quantity - currentQuantity);
  
      // If quantity is zero, remove the item
      if (quantity <= 0) {
        // Remove item completely
        const updatedCart = currentCart.filter(item => item.uniqueId !== uniqueId);
        // Sync to database with the current quantity to subtract all of them
        syncCartToDatabase(existingItem, existingItem.quantity, 'SUBTRACT');
        return { ...prevState, [restaurantId]: updatedCart };
      }
  
      // Update the item quantity
      const updatedCart = currentCart.map((item) => {
        if (item.uniqueId === uniqueId) {
          // Determine whether to add or subtract
          if (quantity > currentQuantity) {
            // Adding more of the item - send the difference to add
            syncCartToDatabase(item, quantityDifference, 'ADD');
          } else if (quantity < currentQuantity) {
            // Reducing the item quantity - send the difference to subtract
            syncCartToDatabase(item, quantityDifference, 'SUBTRACT');
          }
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