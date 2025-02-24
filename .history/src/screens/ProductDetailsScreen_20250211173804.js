import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useCart } from '../context/CartContext'; // 引入 useCart 用来操作购物车

function ProductDetailsScreen({ route }) {
    const { item } = route.params; // 解构获取商品信息
    const { addToCart } = useCart(); // 使用购物车的 hook 来添加菜品
  
    const handleAddToCart = () => {
      addToCart({ ...item, quantity: 1 }); // 默认添加数量为 1
    };
  
    return (
      <ScrollView contentContainerStyle={styles.wrapper}>
        <View style={styles.container}>
          <Image source={{ uri: item.image_url }} style={styles.productImage} />
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productDescription}>{item.description}</Text>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
  
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
  

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    padding: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addToCartButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetailsScreen;
