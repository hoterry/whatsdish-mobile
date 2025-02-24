import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCart } from '../context/CartContext'; 
import { useNavigation } from '@react-navigation/native';    

const GlobalCartButton = () => {
  const { getTotalItems, cartItems } = useCart();  
  const navigation = useNavigation();  

  
  const handlePress = () => {
    if (cartItems.length > 0) {
      navigation.navigate('Cart');  
    } else {
      console.log('购物车为空');  
    }
  };
  
  
  return (
    <View style={styles.cartContainer}>  
      <TouchableOpacity
        style={styles.cartButton}  
        onPress={handlePress}  
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingBottom: 10,
    paddingTop: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cartButton: {
    width: '80%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 25,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 10,
  },
});


export default GlobalCartButton;
