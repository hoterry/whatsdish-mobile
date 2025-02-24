// context/RestaurantContext.js
import React, { createContext, useState, useContext } from 'react';

// 创建一个餐厅上下文
const RestaurantContext = createContext();

// 创建一个提供餐厅信息的组件
export const RestaurantProvider = ({ children }) => {
  const [restaurant, setRestaurant] = useState(null);

  // 设置餐厅数据的函数
  const setRestaurantData = (data) => {
    setRestaurant(data);
  };

  return (
    <RestaurantContext.Provider value={{ restaurant, setRestaurantData }}>
      {children}
    </RestaurantContext.Provider>
  );
};

// 创建一个 hook 来方便组件消费上下文数据
export const useRestaurant = () => {
  return useContext(RestaurantContext);
};
