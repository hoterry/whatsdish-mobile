import React, { createContext, useContext, useState } from 'react';


const OrderHistoryContext = createContext();

export const useOrderHistory = () => useContext(OrderHistoryContext);

export const OrderHistoryProvider = ({ children }) => {

  const [orderHistory, setOrderHistory] = useState([]);

  const addOrder = (order) => {
    setOrderHistory((prevOrders) => [...prevOrders, order]);
  };

  return (
    <OrderHistoryContext.Provider value={{ orderHistory, addOrder }}>
      {children}
    </OrderHistoryContext.Provider>
  );
};
