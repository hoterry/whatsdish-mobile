import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useCart } from '../../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import OrderSummary from './OrderSummary';
import TipSelector from './TipSelector';
import Payment from './Payment';
import DeliveryOptionsButton from './DeliveryOptionsButton';
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from '../../context/LanguageContext';
import { useLoading } from '../../context/LoadingContext';
import * as SecureStore from 'expo-secure-store';

function CheckoutScreen({ route }) {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { language } = useContext(LanguageContext);
  const { setIsLoading } = useLoading();
  const navigation = useNavigation();
  const { restaurantId, restaurants } = route.params;
  
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [pickupOption, setPickupOption] = useState('immediate');
  const [deliveryOption, setDeliveryOption] = useState('immediate');
  const [address, setAddress] = useState('');
  const [pickupScheduledTime, setPickupScheduledTime] = useState(null);
  const [deliveryScheduledTime, setDeliveryScheduledTime] = useState(null);
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [showDeliveryFee, setShowDeliveryFee] = useState(false);
  const [calculatedTip, setCalculatedTip] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasCartItems, setHasCartItems] = useState(false);

  const cart = cartItems[restaurantId] || [];

  useEffect(() => {
    const checkCart = async () => {
      try {
        setIsLoading(true);
        const hasItems = cart.length > 0;
        setHasCartItems(hasItems);
        
        if (__DEV__) {
          console.log('[CheckoutScreen] Checking cart status:', hasItems ? 'Has items' : 'Empty');
        }
      } catch (error) {
        console.error('[CheckoutScreen] Error checking cart:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkCart();
  }, [cart, setIsLoading]);

  useEffect(() => {
    if (__DEV__) {
      console.log('[Check Out Screen Log] Received cart items:', cart); 
      console.log("[Check Out Screen Log] Restaurants data Received:", restaurants);
    }
  }, [cart, restaurants]);

  const subtotal = getTotalPrice(restaurantId);
  const deliveryFee = 4.99;
  const taxes = subtotal * 0.05;
  const totalPrice =
    deliveryMethod === 'delivery' ? subtotal + deliveryFee + taxes : subtotal + taxes;

  const currentTime = new Date();
  
  const generateScheduleTimes = () => {
    const times = [];
    for (let day = 0; day < 5; day++) {
      const dayStart = new Date(currentTime.getTime() + day * 24 * 60 * 60 * 1000);
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const time = new Date(dayStart);
          time.setHours(hour, minute, 0, 0);
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

  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true);
      setIsLoading(true);
      
      if (__DEV__) {
        console.log('[Check Out Screen Log] Processing order...');
      }

      let orderId;
      let orderIdForHistory; 
      try {
        orderId = await SecureStore.getItemAsync('order_id');
        if (!orderId) {
          console.warn('[Check Out Screen Log] order_id not found in SecureStore');
          throw new Error('Order ID not found');
        }
        orderIdForHistory = orderId; 
        
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
      
        const token = await SecureStore.getItemAsync('token');
        if (!token) throw new Error('No token found in SecureStore');
      
        console.log('==================== ORDER DETAILS ====================');
        console.log(`[Check Out Screen Log] ORDER ID: ${orderId}`);
        console.log(`[Check Out Screen Log] API URL: https://dev.whatsdish.com/api/orders/${orderId}/payment`);
        console.log('[Check Out Screen Log] API METHOD: POST');
        console.log('[Check Out Screen Log] API HEADERS:', JSON.stringify({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(requestBody)
        });
      
        if (!placeOrderResponse.ok) {
          throw new Error('Failed to process payment');
        }
      
        const responseData = await placeOrderResponse.json();
        console.log('[Check Out Screen Log] API RESPONSE DATA:', responseData);
        const paymentMeta = responseData?.result?.payment_meta;

        if (paymentMeta) {
          console.log('==================== CREDIT CARD INFO ====================');
          console.log('Card Type:', paymentMeta.CardType);
          console.log('Auth Code:', paymentMeta.AuthCode);
          console.log('Reference Number:', paymentMeta.ReferenceNum);
          console.log('Response Code:', paymentMeta.ResponseCode);
          console.log('Transaction Amount:', paymentMeta.TransAmount);
          console.log('Transaction ID:', paymentMeta.TransID);
          console.log('Message:', paymentMeta.Message);
          console.log('==========================================================');
        } else {
          console.warn('[Check Out Screen Log] No payment_meta found in response');
        }

        if (responseData.success) {
          try {
            console.log('==================== PRINTER INFO ====================');
            console.log(`[Check Out Screen Log] Calling print API for order: ${orderId}`);
            
            const googlePlaceId = responseData.result?.google_place_ids?.[0];
            if (!googlePlaceId) {
              console.warn('[Check Out Screen Log] No Google Place ID found in response');
            } else {
              console.log(`[Check Out Screen Log] Google Place ID: ${googlePlaceId}`);
            }
            
            const restaurantsData = restaurants.data || [];
            const filteredMerchantSettings = restaurantsData.filter(r => r.is_active !== false);
            
            let merchantSetting = filteredMerchantSettings.find(r => r.gid === googlePlaceId);
            
            if (!merchantSetting) {
              merchantSetting = filteredMerchantSettings.find(r => r.id === restaurantId || r.slug === restaurantId);
            }
            
            if (!merchantSetting && filteredMerchantSettings.length > 0) {
              merchantSetting = filteredMerchantSettings[0];
              console.warn('[Check Out Screen Log] Using fallback restaurant for printing');
            }
            
            if (merchantSetting) {
              console.log('[Check Out Screen Log] Found merchant for printing:', merchantSetting.name);
              
              const printerSerialNumber = __DEV__ ? merchantSetting.dev_printer_id : merchantSetting.printer_id;
              const printerLanguage = merchantSetting.printer_language || language.toLowerCase();
              
              console.log(`[Check Out Screen Log] Printer Serial Number: ${printerSerialNumber}`);
              console.log(`[Check Out Screen Log] Printer Language: ${printerLanguage}`);

              if (!printerSerialNumber) {
                console.warn('[Check Out Screen Log] No printer ID configured for restaurant:', merchantSetting.name);
              } else {
                const printOrderRequest = await fetch(
                  //`https://dev.whatsdish.com/api/orders/${orderId}/print?language=${printerLanguage}&serial_number=0162410240008`,//${printerSerialNumber}
                  `https://dev.whatsdish.com/api/orders/${orderId}/print?language=zh-hant&serial_number=0162410240002`,
                  {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    }
                  }
                );
                
                if (!printOrderRequest.ok) {
                  console.warn('[Check Out Screen Log] Printer API returned non-OK status:', printOrderRequest.status);
                }
                
                const printOrderResponse = await printOrderRequest.json();
                console.log('[Check Out Screen Log] Printer API response:', printOrderResponse);
                
                if (!printOrderResponse.success) {
                  console.warn('[Check Out Screen Log] Printing failed:', printOrderResponse.message || 'Unknown error');
                } else {
                  console.log('[Check Out Screen Log] Printing successful!');
                }
              }
            } else {
              console.warn('[Check Out Screen Log] No matching restaurant found for printing');
            }
            console.log('======================================================');
          } catch (printError) {
            console.error('[Check Out Screen Log] Error calling print API:', printError);
          }
        }
      
        clearCart();
        
        try {
          await SecureStore.deleteItemAsync('order_id');
          console.log('[Check Out Screen Log] Successfully cleared order_id from SecureStore');
        } catch (error) {
          console.error('[Check Out Screen Log] Error clearing order_id from SecureStore:', error);
        }
      
        navigation.navigate('HistoryDetail', { 
          order: {
            ...orderData,
            orderId: orderId,
            orderNumber: orderIdForHistory 
          }, 
          restaurantId, 
          restaurants,
          resetOrderState: true
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
      setIsLoading(false);
    }
  };

  if (!hasCartItems) {
    return (
      <View style={styles.emptyCartContainer}>
        <Text style={styles.emptyCartText}>
          {language === 'ZH' ? '您的購物車是空的' : 'Your cart is empty'}
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>
            {language === 'ZH' ? '返回' : 'Go Back'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

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

        {deliveryMethod === 'pickup' && (
          <>
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
          </>
        )}
      </ScrollView>

      {deliveryMethod === 'pickup' ? (
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
      ) : null}
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
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyCartText: {
    fontSize: 18,
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CheckoutScreen;