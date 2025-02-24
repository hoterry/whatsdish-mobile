import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCart } from '../context/CartContext';  // 导入 useCart
import { useNavigation } from '@react-navigation/native';  // 导入 useNavigation

const GlobalCartButton = () => {
  const { getTotalItems, cartItems } = useCart();  // 获取购物车数量和购物车项
  const navigation = useNavigation();  // 获取 navigation 对象

  // 导航到购物车页面
  const handlePress = () => {
    if (cartItems.length > 0) {
      navigation.navigate('Cart');  // 假设你已经有一个 Cart 页面
    } else {
      console.log('购物车为空');  // 如果购物车为空，可以提示用户
    }
  };
  
  
  return (
    <View style={styles.cartContainer}>  
      <TouchableOpacity
        style={styles.cartButton}  // 按钮样式
        onPress={handlePress}  // 执行导航操作
      >
        <View style={styles.buttonContainer}>
          <Text style={styles.cartText}>View Cart ({getTotalItems()})</Text>
          {cartItems.length === 0 && <Text style={styles.emptyText}></Text>}  
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cartContainer: {
    position: 'absolute',  // 绝对定位
    bottom: 0,  // 固定在页面底部
    left: 0,  // 左边缘
    right: 0,  // 右边缘
    backgroundColor: '#fff',  // 背景为白色
    paddingBottom: 10,  // 保证底部有一点内边距
    paddingTop: 10,  // 保证顶部有一点内边距
    elevation: 5,  // 提升按钮的层级
    shadowColor: '#000',  // 阴影颜色
    shadowOffset: { width: 0, height: -2 },  // 阴影偏移
    shadowOpacity: 0.1,  // 阴影透明度
    shadowRadius: 6,  // 阴影半径
  },
  cartButton: {
    width: '80%',  // 设置按钮宽度为屏幕的80%（可以根据需求调整）
    alignSelf: 'center',  // 让按钮水平居中
    flexDirection: 'row',  // 按钮内文本排成横向
    justifyContent: 'center',  // 居中对齐
    alignItems: 'center',  // 垂直居中
    backgroundColor: 'black',  // 按钮背景颜色
    paddingVertical: 10,  // 按钮垂直内边距
    paddingHorizontal: 10,  // 减少按钮的水平内边距
    borderRadius: 25,  // 圆角按钮
  },
  buttonContainer: {
    flexDirection: 'row',  // 按钮内文本排成横向
    justifyContent: 'center',  // 居中对齐
    alignItems: 'center',  // 垂直居中
  },
  cartText: {
    color: '#fff',  // 文本颜色
    fontSize: 18,  // 字体大小
    fontWeight: 'bold',  // 字体加粗
  },
  emptyText: {
    color: '#fff',  // 当购物车为空时显示的文本颜色
    fontSize: 14,  // 字体大小
    marginLeft: 10,  // 左边距
  },
});

export default GlobalCartButton;
