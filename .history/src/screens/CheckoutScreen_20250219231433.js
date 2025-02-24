import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import OrderSummary from '../components/OrderSummary';
import TipSelector from '../components/TipSelector';
import Payment from '../components/Payment';
import DeliveryOptionsButton from '../components/DeliveryOptionsButton';
import Icon from 'react-native-vector-icons/MaterialIcons'; // 導入圖標組件
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from '../context/LanguageContext'; // 引入 LanguageContext

function CheckoutScreen({ route }) {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { language } = useContext(LanguageContext); // 獲取當前語言
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
  
  const cart = cartItems[restaurantId] || [];
  if (cart.length === 0) {
    return <Text>{language === 'ZH' ? '您的購物車是空的' : 'Your cart is empty'}</Text>;
  }

  useEffect(() => {
    console.log('Received cart items:', cart); // 打印傳遞過來的 cartItems
    console.log("Restaurants:", restaurants);

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

  const handlePlaceOrder = () => {
    console.log('Order Placed!');
  
    // 構建訂單數據
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
    };

    // 清空購物車
    clearCart();

    // 跳轉到 OrderHistory 頁面並傳遞訂單數據
    navigation.navigate('HomeTabs', {
      screen: 'Orders',
      params: { order: orderData }  // 傳遞訂單數據
    });
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
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderText}>
            {language === 'ZH' ? '確認下單' : 'Place Order'} {/* 根據語言顯示按鈕文字 */}
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
    justifyContent: 'center', // 讓標題在水平方向居中
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    zIndex: 10,
  },
  backButton: {
    position: 'absolute',
    top: 0, // 與 DetailsScreen 保持一致
    left: 10,
    zIndex: 10, // 確保在最上層
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // 半透明背景
    borderRadius: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1, // 讓標題可以自適應，保持在中間
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 70, // 確保滾動內容不會被標題擋住
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
  placeOrderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default CheckoutScreen;

