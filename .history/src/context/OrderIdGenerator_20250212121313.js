// OrderIdGenerator.js
import React from 'react';
import { View, Text } from 'react-native';

const OrderIdGenerator = ({ onGenerate }) => {
  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `ORD-${timestamp}-${random}`;
  };

  // 在組件加載時生成訂單 ID 並通過回調函數返回
  React.useEffect(() => {
    const orderId = generateOrderId();
    onGenerate(orderId);
  }, [onGenerate]);

  return null; // 這個組件不需要渲染任何 UI
};

export default OrderIdGenerator;