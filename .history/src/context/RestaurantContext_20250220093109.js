// context/RestaurantContext.js
import React, { createContext, useState, useContext } from 'react';

const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [restaurant, setRestaurant] = useState(null);

  const setRestaurantData = (data) => {
    setRestaurant(data);
  };

  return (
    <RestaurantContext.Provider value={{ restaurant, setRestaurantData }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  return useContext(RestaurantContext);
};
