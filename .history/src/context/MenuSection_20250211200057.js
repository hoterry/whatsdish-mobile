import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useCart } from '../context/CartContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import { LanguageContext } from '../context/LanguageContext';  // 引入 LanguageContext

function CartScreen() {
  const { cartItems, removeFromCart, addToCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();
  const navigation = useNavigation();
  const route = useRoute();
  const { restaurantId, restaurants } = route.params;
  const { language } = useContext(LanguageContext);  // 获取当前语言

  const safeCart = cartItems[restaurantId] || [];

  const handleIncreaseQuantity = (uniqueId) => {
    const item = safeCart.find(item => item.uniqueId === uniqueId);
    if (item) {
      addToCart(restaurantId, item, 1);
    }
  };

  const handleDecreaseQuantity = (uniqueId) => {
    const item = safeCart.find(item => item.uniqueId === uniqueId);
    if (item && item.quantity > 1) {
      updateQuantity(restaurantId, item.uniqueId, item.quantity - 1);
    }
  };

  const renderCartItem = (item) => {
    const key = item.uniqueId || `${item.name}-${item.price}-${item.quantity}`;
  
    return (
      <View style={styles.cartItem} key={key}>
        <Image source={{ uri: item.image_url }} style={styles.cartItemImage} />
        <View style={styles.cartItemDetails}>
          <Text style={styles.cartItemName}>{item.name}</Text>
  
          {item.selectedOption && (
            <View style={styles.selectedOptionContainer}>
              <Text style={styles.selectedOptionTitle}>{language === 'ZH' ? '尺寸' : 'Size'}:</Text>
              <Text style={styles.selectedOptionText}>
                {item.selectedOption.name} (${item.selectedOption.price})
              </Text>
            </View>
          )}
  
          {item.selectedModifiers && item.selectedModifiers.length > 0 && (
            <View style={styles.modifiersContainer}>
              <Text style={styles.modifiersTitle}>{language === 'ZH' ? '附加项目' : 'Modifiers'}:</Text>
              {item.selectedModifiers.map((modifier, index) => (
                <Text key={index} style={styles.modifierText}>
                  {modifier.name} (+${modifier.price})
                </Text>
              ))}
            </View>
          )}
  
          <Text style={styles.cartItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
  
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => handleDecreaseQuantity(item.uniqueId)} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity onPress={() => handleIncreaseQuantity(item.uniqueId)} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
  
        <TouchableOpacity onPress={() => removeFromCart(restaurantId, item.uniqueId)} style={styles.removeButton}>
          <Text style={styles.removeButtonText}>{language === 'ZH' ? '移除' : 'Remove'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>{language === 'ZH' ? '购物车' : 'Your Cart'}</Text>
        {safeCart.length === 0 ? (
          <Text style={styles.emptyText}>{language === 'ZH' ? '您的购物车为空' : 'Your cart is empty'}</Text>
        ) : (
          safeCart.map(item => renderCartItem(item))
        )}
        {safeCart.length > 0 && (
          <View style={styles.checkoutContainer}>
            <Text style={styles.totalPrice}>
              {language === 'ZH' ? '总计' : 'Total'}: ${getTotalPrice(restaurantId).toFixed(2)}
            </Text>
            <Text style={styles.totalItems}>
              {language === 'ZH' ? '总数' : 'Total Items'}: {getTotalItems(restaurantId)}
            </Text>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => navigation.navigate('Checkout', { restaurantId, restaurants, cartItems: safeCart })}
            >
              <Text style={styles.checkoutButtonText}>{language === 'ZH' ? '结算' : 'Checkout'}</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>{language === 'ZH' ? '返回' : 'Go Back'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
  
};const styles = StyleSheet.create({
  categoryHeader: {
    fontSize: 20,
    fontFamily: 'Urbanist-ExtraBold',
    fontWeight: 'bold',
    marginVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 5,
    maxWidth: 240,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    lineHeight: 20,
    maxHeight: 48, // 限制最大高度，防止过长的描述
    maxWidth: 240,
    overflow: 'hidden', // 超出部分隐藏
    textOverflow: 'ellipsis', // 添加省略号
    whiteSpace: 'nowrap', // 防止换行，保持单行显示
  },
  price: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',  // 保持左右排布
    padding: 15,
    marginBottom: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center', // 确保内容垂直居中
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: 130,  // 固定高度，确保图片和文字在同一高度
    justifyContent: 'space-between',  // 让内容分布在两端
    width: '100%',  // 确保占满屏幕宽度
  },
  info: {
    flex: 1,  // 让文本占用剩余空间
    marginRight: 15,  // 保持与图片的间距
    justifyContent: 'center',  // 确保文本垂直居中
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  categoryList: {
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  categoryItem: {
    marginRight: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  selectedCategory: {
    borderBottomWidth: 2.5,
    borderBottomColor: 'black',
  },
  categoryText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 29,
    textAlignVertical: 'center',
  },
  flatList: {
    marginBottom: '180%',
  },
  addButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // 半透明的黑色背景
    width: 30,  // 按钮宽度
    height: 30, // 按钮高度
    borderRadius: 50,  // 圆形按钮
    position: 'absolute',
    bottom: 15,
    right: 15,
    justifyContent: 'center',  // 垂直居中
    alignItems: 'center',  // 水平居中
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,  // 增大“+”符号的字体大小
    fontWeight: 'bold', // 加粗
  },
  viewCartButton: {
    position: 'absolute',
    top: '38%',
    left: 20,
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    zIndex: 999,
    width: '90%',
    height: '4%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  viewCartButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

  
export default MenuSection;
