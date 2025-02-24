import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import OrderSummary from '../components/OrderSummary';
import TipSelector from '../components/TipSelector';
import Payment from '../components/Payment';
import DeliveryOptionsButton from '../components/DeliveryOptionsButton';
import Icon from 'react-native-vector-icons/MaterialIcons'; // 導入圖標組件

function CheckoutScreen({ route }) {
  const { cartItems, getTotalPrice } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [pickupOption, setPickupOption] = useState('immediate');
  const [deliveryOption, setDeliveryOption] = useState('immediate');
  const [address, setAddress] = useState('');
  const navigation = useNavigation();
  const { restaurantId } = route.params;
  const [pickupScheduledTime, setPickupScheduledTime] = useState(null);
  const [deliveryScheduledTime, setDeliveryScheduledTime] = useState(null);
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [showDeliveryFee, setShowDeliveryFee] = useState(false);
  const [calculatedTip, setCalculatedTip] = useState(0);

  const cart = cartItems[restaurantId] || [];
  if (cart.length === 0) {
    return <Text>Your cart is empty</Text>;
  }

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
    // 這裡可以加入訂單提交的邏輯
  };

  return (
    <View style={styles.container}>
      {/* 可滾動內容區域 */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <Icon name="arrow-back" size={30} color="#000" />
        </TouchableOpacity>
  
        <Text style={styles.header}>Checkout</Text>
  
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
  
      {/* 固定在底部的 Place Order 按鈕 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100, // 增加頂部空間
    backgroundColor: '#fff',
    paddingHorizontal: 0, // 讓整體更寬敞
  },
  header: {
    fontSize: 34, // 字體變大
    fontWeight: 'bold',
    marginBottom: 20, // 增加間距
    textAlign: 'center',
    paddingTop: 40,
  },
  backIcon: {
    position: 'absolute',
    top: 20, // 增加與邊緣的距離
    left: 30, // 增加左右間距
    zIndex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    minWidth: '100%', 
    paddingBottom: 120, 
    paddingHorizontal: 10, // 增加整體寬度
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 18, // 增加按鈕區塊高度
    paddingHorizontal: 30,
    borderTopWidth: 2, // 加厚邊框
    borderTopColor: '#ddd',
  },
  placeOrderButton: {
    backgroundColor: '#000',
    paddingVertical: 18, // 增加按鈕高度
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30, // 增加按鈕間距
  },
  placeOrderText: {
    fontSize: 18, // 字體變大
    fontWeight: 'bold',
    color: '#fff',
  },
});



export default CheckoutScreen;

