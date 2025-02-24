import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // 导入导航

function OrderHistoryScreen() {
  const navigation = useNavigation(); // 使用导航功能

  // 示例：硬编码历史订单数据，未来可以从本地存储或API获取
  const orders = [
    {
      id: '1',
      date: '2024-11-01',
      total: 29.99,
      deliveryMethod: 'Standard Delivery',
      items: [
        { name: 'Margherita Pizza', image: 'https://res.cloudinary.com/dfbpwowvb/image/upload/v1733548608/hv7rwgkg9gx4n0jl15yp.jpg', quantity: 1 },
        { name: 'Cheeseburger', image: 'https://res.cloudinary.com/dfbpwowvb/image/upload/v1733548608/folc3skfl02ycw0socjr.jpg', quantity: 2 },
      ],
    },
    {
      id: '2',
      date: '2024-11-10',
      total: 45.50,
      deliveryMethod: 'Express Delivery',
      items: [
        { name: 'California Roll', image: 'https://example.com/images/sushi.jpg', quantity: 1 },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order History</Text>
      
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text style={styles.orderDate}>Date: {item.date}</Text>
            <Text style={styles.orderTotal}>Total: ${item.total.toFixed(2)}</Text>
            <Text style={styles.orderDelivery}>Delivery: {item.deliveryMethod}</Text>

            <FlatList
              data={item.items}
              keyExtractor={(foodItem) => foodItem.name}
              renderItem={({ item }) => (
                <View style={styles.foodItem}>
                  <Image source={{ uri: item.image }} style={styles.foodImage} />
                  <Text style={styles.foodName}>{item.name} x{item.quantity}</Text>
                </View>
              )}
            />
          </View>
        )}
      />

      {/* 返回按钮 */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9', // 背景颜色
    top: 50,
    marginBottom: 80
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333', // 改变字体颜色
  },
  orderItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // 阴影效果
  },
  orderDate: {
    fontSize: 16,
    color: '#555', // 修改字体颜色
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32', // 总价颜色
  },
  orderDelivery: {
    fontSize: 16,
    marginBottom: 10,
    fontStyle: 'italic',
    color: '#757575',
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  foodImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  foodName: {
    fontSize: 16,
    color: '#333',
  },
  backButton: {
    paddingVertical: 12,
    backgroundColor: '#000',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default OrderHistoryScreen;
