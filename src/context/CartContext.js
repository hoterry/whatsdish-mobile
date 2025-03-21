import React, { createContext, useContext, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});

  const syncCartToContext = (restaurantId, fetchedCartItems) => {
    setCartItems((prevState) => {
      const updatedCart = fetchedCartItems.map((item) => {
        const uniqueId = item.hash 
          ? `${restaurantId}-${item.item_id}-${item.hash}` 
          : `${restaurantId}-${item.item_id || item.id}-${
              item.modifications && item.modifications.length > 0 
                ? `mods-${item.modifications.map(m => `${m.mod_id}-${m.count || 1}`).sort().join('-')}` 
                : 'no-modifiers'
            }`;
        
        const selectedModifiers = item.modifications?.map(mod => ({
          mod_id: mod.mod_id || mod.id,
          mod_group_id: mod.mod_group_id || mod.groupId,
          name: mod.name || '',
          price: mod.price || 0, 
          count: mod.count || 1,
        })) || [];

        const existingCartItems = prevState[restaurantId] || [];
        const existingItem = item.hash 
          ? existingCartItems.find(oldItem => oldItem.hash === item.hash)
          : existingCartItems.find(oldItem => oldItem.uniqueId === uniqueId);

        let enhancedModifiers = selectedModifiers;
        let basePrice = item.price || 0;
        
        if (existingItem) {
          enhancedModifiers = selectedModifiers.map(mod => {
            const existingMod = existingItem.selectedModifiers?.find(
              m => m.mod_id === mod.mod_id
            );

            if (existingMod) {
              return {
                ...mod,
                name: existingMod.name || mod.name,
                price: existingMod.price || mod.price,
              };
            }
            
            return mod;
          });

          basePrice = existingItem.price || basePrice;
        }

        const modifiersPrice = enhancedModifiers.reduce((total, mod) => 
          total + (mod.price || 0) * (mod.count || 1), 0
        );
        
        return {
          ...item,
          uniqueId,
          name: item.name || (existingItem ? existingItem.name : 'Unnamed Item'),
          price: basePrice,
          modifiersPrice,
          totalItemPrice: basePrice + modifiersPrice,
          quantity: item.quantity || item.count || 1, 
          image_url: item.image_url || (existingItem ? existingItem.image_url : ''),
          selectedModifiers: enhancedModifiers,
          selectedOption: null,
        };
      });
      return { ...prevState, [restaurantId]: updatedCart };
    });
  };
  
  const getCart = (restaurantId) => cartItems[restaurantId] || [];
  
  const syncCartToDatabase = async (item, quantity, mode, options = {}) => {
    try {
      console.log(`[CartContext Log] Sync Start - Mode: ${mode}`, { item, quantity });
  
      const order_id = await SecureStore.getItemAsync('order_id');
      const accountId = await SecureStore.getItemAsync('accountId');
  
      if (!order_id || !accountId) {
        console.error("[CartContext ERROR] Missing order_id or accountId in SecureStore");
        return { success: false, error: "Missing credentials" };
      }
  
      if (quantity <= 0) {
        console.error("[CartContext ERROR] Quantity must be positive");
        return { success: false, error: "Quantity must be positive" };
      }
  
      const payload = {
        item_id: item.item_id || item.id,
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
  
      const forceUpdate = options.forceUpdate;
      const fetchCurrentCount = options.fetchCurrentCount;
  
      if (fetchCurrentCount && mode === 'ADD') {
        try {
          const apiUrl = `https://dev.whatsdish.com/api/orders/${order_id}/items`;
          const response = await fetch(apiUrl);
          const cartData = await response.json();
          
          const serverItem = cartData.items?.find(item => 
            item.item_id === payload.item_id && item.gid === payload.gid
          );
          
          if (serverItem && serverItem.count > quantity && !forceUpdate) {
            console.log(`[CartContext Log] Server count (${serverItem.count}) is higher than requested (${quantity}). Use SUBTRACT instead.`);
            return { 
              success: true, 
              prev_count: serverItem.count, 
              new_count: serverItem.count,
              message: "Cannot decrease count via ADD. Use SUBTRACT instead."
            };
          }
        } catch (error) {
          console.error("[CartContext ERROR] Failed to fetch current cart:", error);
        }
      }
  
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
      return { success: false, error: error.message };
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

      const existingItemIndex = item.hash 
        ? restaurantCart.findIndex(cartItem => cartItem.hash === item.hash)
        : restaurantCart.findIndex(cartItem => cartItem.uniqueId === item.uniqueId);
        
      const updatedCart = [...restaurantCart];
  
      if (existingItemIndex >= 0) {
        const newQuantity = updatedCart[existingItemIndex].quantity + quantity;
        updatedCart[existingItemIndex].quantity = newQuantity;
        updatedCart[existingItemIndex].selectedModifiers = safeModifiers;
        
        syncCartToDatabase(updatedCart[existingItemIndex], newQuantity, 'ADD')
          .then(response => {
            console.log("[CartContext Log] ADD response:", response);
            
            if (response.message && response.message.includes("cannot be decreased")) {
              console.log("[CartContext Log] API rejected update, current server count:", response.prev_count);
              
              setCartItems(prevState => {
                const cart = [...(prevState[restaurantId] || [])];
                const itemIndex = cart.findIndex(item => item.uniqueId === updatedCart[existingItemIndex].uniqueId);
                
                if (itemIndex >= 0) {
                  cart[itemIndex] = { ...cart[itemIndex], quantity: response.prev_count };
                }
                
                return { ...prevState, [restaurantId]: cart };
              });
            }

            if (response.hash && !updatedCart[existingItemIndex].hash) {
              setCartItems(prevState => {
                const cart = [...(prevState[restaurantId] || [])];
                const itemIndex = cart.findIndex(item => item.uniqueId === updatedCart[existingItemIndex].uniqueId);
                
                if (itemIndex >= 0) {
                  cart[itemIndex] = { 
                    ...cart[itemIndex], 
                    hash: response.hash,
                    uniqueId: `${restaurantId}-${cart[itemIndex].item_id}-${response.hash}`
                  };
                }
                
                return { ...prevState, [restaurantId]: cart };
              });
            }
          })
          .catch(error => {
            console.error("[CartContext ERROR] Failed to add to cart:", error);
          });
      } else {
        updatedCart.push({ ...item, quantity, selectedModifiers: safeModifiers });

        syncCartToDatabase(item, quantity, 'ADD')
          .then(response => {
            if (response.hash) {
              setCartItems(prevState => {
                const cart = [...(prevState[restaurantId] || [])];
                const newItemIndex = cart.findIndex(cartItem => 
                  !cartItem.hash && cartItem.item_id === item.item_id && 
                  JSON.stringify(cartItem.selectedModifiers) === JSON.stringify(safeModifiers)
                );
                
                if (newItemIndex >= 0) {
                  cart[newItemIndex] = { 
                    ...cart[newItemIndex], 
                    hash: response.hash,
                    uniqueId: `${restaurantId}-${cart[newItemIndex].item_id}-${response.hash}`
                  };
                }
                
                return { ...prevState, [restaurantId]: cart };
              });
            }
          })
          .catch(error => {
            console.error("[CartContext ERROR] Failed to add new item:", error);
          });
      }
  
      return { ...prevState, [restaurantId]: updatedCart };
    });
  };

  const removeFromCart = (restaurantId, uniqueId) => {
    console.log("[CartContext Log] removeFromCart called with:", { restaurantId, uniqueId });
  
    setCartItems((prevState) => {
      const currentCart = getCart(restaurantId);
      const removedItem = currentCart.find(item => item.uniqueId === uniqueId);
  
      if (!removedItem) {
        console.error("[CartContext ERROR] Item not found for removal:", uniqueId);
        return prevState;
      }
  
      const updatedCart = currentCart.filter(item => item.uniqueId !== uniqueId);
  
      const removeAllItems = async () => {
        try {
          let remaining = removedItem.quantity;
          while (remaining > 0) {
            console.log(`[CartContext Log] Removing item (${removedItem.quantity - remaining + 1}/${removedItem.quantity})`);
            
            const response = await syncCartToDatabase(removedItem, 1, 'SUBTRACT');
            console.log("[CartContext Log] Remove response:", response);
            
            if (response.success) {
              remaining = response.new_count;
            } else {
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }
          console.log("[CartContext Log] All items successfully removed");
        } catch (error) {
          console.error("[CartContext ERROR] Error during item removal:", error);
        }
      };
      
      removeAllItems();
      
      return { ...prevState, [restaurantId]: updatedCart };
    });
  };
  
  const updateQuantity = (restaurantId, uniqueId, quantity) => {
    console.log("[CartContext Log] updateQuantity called with:", { restaurantId, uniqueId, quantity });
  
    const currentCart = getCart(restaurantId);
    const existingItem = currentCart.find(item => item.uniqueId === uniqueId);
    
    if (!existingItem) {
      console.error("[CartContext ERROR] Item not found in cart:", uniqueId);
      return;
    }
  
    const currentQuantity = existingItem.quantity;
    
    let updatedCart;
    
    if (quantity <= 0) {
      updatedCart = currentCart.filter(item => item.uniqueId !== uniqueId);
      
      const removeAllItems = async () => {
        let remaining = currentQuantity;
        while (remaining > 0) {
          const response = await syncCartToDatabase(existingItem, 1, 'SUBTRACT');
          console.log("[CartContext Log] Remove one item response:", response);
          
          if (response.success) {
            remaining = response.new_count;
          } else {
            break;
          }
        }
      };
      
      removeAllItems();
    } else if (quantity < currentQuantity) {
      updatedCart = currentCart.map(item => 
        item.uniqueId === uniqueId ? { ...item, quantity } : item
      );
      
      const toReduce = currentQuantity - quantity;
      
      const reduceQuantity = async () => {
        for (let i = 0; i < toReduce; i++) {
          const response = await syncCartToDatabase(existingItem, 1, 'SUBTRACT');
          console.log(`[CartContext Log] Reduce quantity (${i+1}/${toReduce})`, response);
          
          if (!response.success) {
            break;
          }
        }
      };
      
      reduceQuantity();
    } else if (quantity > currentQuantity) {
      updatedCart = currentCart.map(item => 
        item.uniqueId === uniqueId ? { ...item, quantity } : item
      );
      
      syncCartToDatabase(existingItem, quantity, 'ADD', { fetchCurrentCount: true })
        .then(response => {
          console.log("[CartContext Log] ADD response:", response);
          
          if (response.message && (
              response.message.includes("cannot be decreased") || 
              response.message.includes("Use SUBTRACT instead")
          )) {
            console.log("[CartContext Log] API rejected update, current server count:", response.prev_count);
            
            setCartItems(prevState => {
              const cart = [...(prevState[restaurantId] || [])];
              const itemIndex = cart.findIndex(item => item.uniqueId === uniqueId);
              
              if (itemIndex >= 0) {
                cart[itemIndex] = { ...cart[itemIndex], quantity: response.prev_count };
              }
              
              return { ...prevState, [restaurantId]: cart };
            });
          }
        });
    } else {
      updatedCart = currentCart;
    }
    
    setCartItems(prevState => ({ ...prevState, [restaurantId]: updatedCart }));
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
  const totalPrice = restaurantCart.reduce((total, item) => {
    const itemBasePrice = item.price || 0;

    const modifiersTotalPrice = (item.selectedModifiers || []).reduce(
      (modTotal, modifier) => modTotal + ((modifier.price || 0) / 100) * (modifier.count || 1), 
      0
    );

    const itemTotalPrice = (itemBasePrice + modifiersTotalPrice) * item.quantity;
    
    return total + itemTotalPrice;
  }, 0);
  
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
