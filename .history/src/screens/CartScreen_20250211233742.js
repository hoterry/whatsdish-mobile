import React, { useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useCart } from '../context/CartContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import { LanguageContext } from '../context/LanguageContext';
import { Ionicons } from '@expo/vector-icons'; // 引入图标库

function CartScreen() => {
  // ...其他代码保持不变...

  const renderCartItem = (item) => {
    const key = item.uniqueId || `${item.name}-${item.price}-${item.quantity}`;

    return (
      <View style={styles.cartItem} key={key}>
        <Image source={{ uri: item.image_url }} style={styles.cartItemImage} />
        <View style={styles.cartItemDetails}>
          {/* 商品名称和其他信息保持不变... */}

          {/* 价格和数量控制移动到右侧 */}
          <View style={styles.rightSection}>
            <Text style={styles.cartItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
            
            <View style={styles.quantityContainer}>
              {/* 动态左侧按钮 */}
              <TouchableOpacity 
                onPress={() => {
                  if (item.quantity > 1) {
                    handleDecreaseQuantity(item.uniqueId);
                  } else {
                    removeFromCart(restaurantId, item.uniqueId);
                  }
                }} 
                style={styles.quantityButton}
              >
                {item.quantity > 1 ? (
                  <Text style={styles.quantityButtonText}>-</Text>
                ) : (
                  <Ionicons name="trash-outline" size={24} color="#ff4444" />
                )}
              </TouchableOpacity>

              <Text style={styles.quantityText}>{item.quantity}</Text>

              <TouchableOpacity 
                onPress={() => handleIncreaseQuantity(item.uniqueId)} 
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // ...其他代码保持不变...
};

const styles = StyleSheet.create({
  // ...其他样式保持不变...

  cartItem: {
    flexDirection: 'row',
    alignItems: 'flex-start', // 顶部对齐
    marginBottom: 16,
    position: 'relative', // 为绝对定位提供参考
  },

  cartItemDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between', // 分散对齐
  },

  rightSection: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    alignItems: 'flex-end',
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  quantityButton: {
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },

  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '500',
  },

  // 移除原来的 removeButton 相关样式
});