import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const PlaceOrderButton = ({ orderData, clearCart, language }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = React.useState(false);

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    try {

      await new Promise(resolve => setTimeout(resolve, 1000));

      clearCart();

      navigation.navigate('HomeTabs', {
        screen: 'Orders',
        params: { order: orderData },
      });
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.buttonContainer}>
    <TouchableOpacity
      style={styles.placeOrderButton}
      onPress={handlePlaceOrder}
      disabled={loading}
    >
      {loading ? (
        <Text style={styles.placeOrderText}>
          {language === 'ZH' ? '提交中...' : 'Submitting...'}
        </Text>
      ) : (
        <Text style={styles.placeOrderText}>
          {language === 'ZH' ? '確認下單' : 'Place Order'}
        </Text>
      )}
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingVertical: 18, 
        paddingHorizontal: 30,
        borderTopWidth: 2, 
        borderTopColor: '#ddd',
      },
      placeOrderButton: {
        backgroundColor: '#000',
        paddingVertical: 18, 
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
      },
      placeOrderText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
      },
});

export default PlaceOrderButton;