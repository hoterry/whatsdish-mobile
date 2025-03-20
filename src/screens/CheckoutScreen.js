import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import OrderSummary from '../components/OrderSummary';
import TipSelector from '../components/TipSelector';
import Payment from '../components/Payment';
import DeliveryOptionsButton from '../components/DeliveryOptionsButton';
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from '../context/LanguageContext';
import * as SecureStore from 'expo-secure-store';

function CheckoutScreen({ route }) {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { language } = useContext(LanguageContext);
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [pickupOption, setPickupOption] = useState('immediate');
  const [deliveryOption, setDeliveryOption] = useState('immediate');
  const [address, setAddress] = useState('');
  const navigation = useNavigation();
  const { restaurantId, restaurants } = route.params;
  const [pickupScheduledTime, setPickupScheduledTime] = useState(null);
  const [deliveryScheduledTime, setDeliveryScheduledTime] = useState(null);
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [showDeliveryFee, setShowDeliveryFee] = useState(false);
  const [calculatedTip, setCalculatedTip] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const cart = cartItems[restaurantId] || [];  
  if (cart.length === 0) {
    return <Text>{language === 'ZH' ? '您的購物車是空的' : 'Your cart is empty'}</Text>;
  }

  useEffect(() => {
    if (__DEV__) {
      console.log('[Check Out Screen Log] Received cart items:', cart); 
      console.log("[Check Out Screen Log] Restaurants data Received:", restaurants);
    }
  }, [cart]);

  const subtotal = getTotalPrice(restaurantId);
  const deliveryFee = 4.99;
  const taxes = subtotal * 0.05;
  const totalPrice =
    deliveryMethod === 'delivery' ? subtotal + deliveryFee + taxes : subtotal + taxes;

  const handleDeliveryMethodChange = (method) => {
    setDeliveryMethod(method);
    setShowDeliveryFee(method === 'delivery');
  };

  const handleChangeAddress = () => {
    navigation.navigate('AddressPicker', { updateAddress: setAddress });
  };

  const handleTipChange = (tipAmount) => {
    setCalculatedTip(tipAmount);
  };

  const currentTime = new Date();
  const generateScheduleTimes = () => {
    const times = [];
    for (let day = 0; day < 5; day++) {
      const dayStart = new Date(currentTime.getTime() + day * 24 * 60 * 60 * 1000);
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const time = new Date(dayStart.setHours(hour, minute, 0, 0));
          times.push(time);
        }
      }
    }
    return times;
  };

  const scheduleTimes = generateScheduleTimes();

  const formatDate = (date) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = daysOfWeek[date.getDay()];
    const month = date.getMonth() + 1;
    const dayOfMonth = date.getDate();
    return `${day}, ${month}/${dayOfMonth}`;
  };

  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true);
      
      if (__DEV__) {
        console.log('[Check Out Screen Log] Processing order...');
      }

      // Get order_id from SecureStore
      let orderId;
      try {
        orderId = await SecureStore.getItemAsync('order_id');
        if (!orderId) {
          console.warn('[Check Out Screen Log] order_id not found in SecureStore');
          throw new Error('Order ID not found');
        }
        
        if (__DEV__) {
          console.log('[Check Out Screen Log] Retrieved order_id from SecureStore:', orderId);
        }
      } catch (secureStoreError) {
        console.error('[Check Out Screen Log] Failed to get order_id from SecureStore:', secureStoreError);
        throw new Error('Failed to retrieve order ID');
      }

      const orderData = {
        restaurantId,
        items: cart,
        totalPrice,
        deliveryMethod,
        deliveryOption,
        deliveryScheduledTime,
        pickupOption,
        pickupScheduledTime,
        address,
        tip: calculatedTip,
        payment: {
          creditCardNumber,
          expirationDate,
          cvv
        },
        orderTime: new Date().toISOString(),
        restaurants
      };

      try {
        const ipResponse = await fetch("https://checkip.amazonaws.com/");
        const clientIp = (await ipResponse.text()).trim();

        console.log('==================== ORDER DETAILS ====================');
        console.log(`[Check Out Screen Log] ORDER ID: ${orderId}`);
        console.log(`[Check Out Screen Log] API URL: https://dev.whatsdish.com/api/orders/${orderId}/payment`);
        console.log('[Check Out Screen Log] API METHOD: POST');
        console.log('[Check Out Screen Log] API HEADERS:', JSON.stringify({
          'Content-Type': 'application/json',
        }, null, 2));
        
        const requestBody = {
          ip: clientIp,
        };
        console.log('[Check Out Screen Log] API REQUEST BODY:', JSON.stringify(requestBody, null, 2));
        console.log('======================================================');
        
        const placeOrderResponse = await fetch(`https://dev.whatsdish.com/api/orders/${orderId}/payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
        
        if (!placeOrderResponse.ok) {
          throw new Error('Failed to process payment');
        }
        
        const responseData = await placeOrderResponse.json();

        clearCart();
        
        navigation.navigate('HistoryDetail', { 
          order: {
            ...orderData,
            orderId: orderId
          }, 
          restaurantId, 
          restaurants 
        });
        
      } catch (error) {
        console.error('[Check Out Screen Log] API call failed:', error);
        Alert.alert(
          language === 'ZH' ? '訂單處理錯誤' : 'Order Processing Error',
          language === 'ZH' ? '無法完成付款處理。請稍後再試。' : 'Unable to complete payment processing. Please try again later.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('[Check Out Screen Log] Order processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>
          {language === 'ZH' ? '結帳' : 'Checkout'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <DeliveryOptionsButton
          deliveryMethod={deliveryMethod}
          pickupOption={pickupOption}
          pickupScheduledTime={pickupScheduledTime}
          deliveryOption={deliveryOption}
          deliveryScheduledTime={deliveryScheduledTime}
          address={address}
          currentTime={currentTime}
          scheduleTimes={scheduleTimes}
          onDeliveryMethodChange={handleDeliveryMethodChange}
          onPickupOptionChange={setPickupOption}
          onPickupTimeChange={(itemValue) => {
            const newTime = new Date(itemValue);
            setPickupScheduledTime(newTime);
          }}
          onDeliveryOptionChange={setDeliveryOption}
          onDeliveryTimeChange={(itemValue) => {
            const newTime = new Date(itemValue);
            setDeliveryScheduledTime(newTime);
          }}
          onAddressChange={handleChangeAddress}
          formatDate={formatDate}
          restaurantId={restaurantId} 
          restaurants={restaurants}   
        />
  
        <OrderSummary
          cart={cart}
          subtotal={subtotal}
          showDeliveryFee={showDeliveryFee}
          deliveryFee={deliveryFee}
          taxes={taxes}
          totalPrice={totalPrice}
        />
  
        <Payment
          creditCardNumber={creditCardNumber}
          setCreditCardNumber={setCreditCardNumber}
          expirationDate={expirationDate}
          setExpirationDate={setExpirationDate}
          cvv={cvv}
          setCvv={setCvv}
        />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.placeOrderButton, isProcessing && styles.disabledButton]} 
          onPress={handlePlaceOrder}
          disabled={isProcessing}
        >
          <Text style={styles.placeOrderText}>
            {isProcessing 
              ? (language === 'ZH' ? '處理中...' : 'Processing...') 
              : (language === 'ZH' ? '確認下單' : 'Place Order')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 80
  },
  headerContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    zIndex: 10,
  },
  backButton: {
    position: 'absolute',
    top: 0, 
    left: 10,
    zIndex: 10, 
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    borderRadius: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1, 
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 70, 
    paddingBottom: 120, 
    paddingHorizontal: 15, 
  },
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
  disabledButton: {
    backgroundColor: '#888',
  },
  placeOrderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default CheckoutScreen;