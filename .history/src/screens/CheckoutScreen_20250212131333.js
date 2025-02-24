import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FontAwesome } from 'react-native-vector-icons';
import { TextInput } from 'react-native';
import { generateOrderId } from '../context/OrderIdGenerator';
import OrderSummary from '../components/OrderSummary';
import TipSelector from '../components/TipSelector';
import PaymentMethod from '../components/PaymentMethod';
import DeliveryOptions from '../components/DeliveryOptions';

function CheckoutScreen({ route }) {
  const { cartItems, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [pickupOption, setPickupOption] = useState('immediate');
  const [deliveryOption, setDeliveryOption] = useState('immediate');
  const [scheduledTime, setScheduledTime] = useState(null);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const navigation = useNavigation();
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const { restaurantId, restaurants } = route.params;
  const [pickupScheduledTime, setPickupScheduledTime] = useState(null);
  const [deliveryScheduledTime, setDeliveryScheduledTime] = useState(null);
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [tipPercentage, setTipPercentage] = useState(0);
  const [tipCustom, setTipCustom] = useState('');
  const [tipAmount, setTipAmount] = useState(0);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const customerName = 'Terry Ho';

  const cart = cartItems[restaurantId] || [];
  if (cart.length === 0) {
    return <Text>Your cart is empty</Text>;
  }

  const handleTipPercentageSelect = (percentage) => {
    setTipPercentage(percentage);
    setTipCustom('');
  };

  const handleCustomTipChange = (text) => {
    const value = parseFloat(text) || 0;
    setTipPercentage(0);
    setTipAmount(value);
    setTipCustom(text.replace(/[^0-9.]/g, ''));
  };

  const calculatedTip = tipCustom
    ? parseFloat(tipCustom) || 0
    : (totalPrice * tipPercentage) / 100;

  const subtotal = getTotalPrice(restaurantId);
  const deliveryFee = 4.99;
  const taxes = subtotal * 0.05;
  const totalPrice = deliveryMethod === 'delivery' ? subtotal + deliveryFee + taxes : subtotal + taxes;
  const [showDeliveryFee, setShowDeliveryFee] = useState(false);

  const handleDeliveryMethodChange = (method) => {
    setDeliveryMethod(method);
    if (method === 'pickup') {
      setShowDeliveryFee(false);
    } else if (method === 'delivery') {
      setShowDeliveryFee(true);
    } else {
      setShowDeliveryFee(false);
    }
  };

  const handleChangeAddress = () => {
    navigation.navigate('AddressPicker', { updateAddress: (newAddress) => setAddress(newAddress) });
  };

  const handlePickupTimeChange = (itemValue) => {
    const newTime = new Date();
    newTime.setDate(newTime.getDate() + itemValue);
    setPickupScheduledTime(newTime);
  };

  const handleDeliveryTimeChange = (itemValue) => {
    const newTime = new Date();
    newTime.setDate(newTime.getDate() + itemValue);
    setDeliveryScheduledTime(newTime);
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

  const renderOrderItem = (item) => (
    <View style={styles.orderItem} key={item.uniqueId}>
      <Image source={{ uri: item.image_url }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemQuantity}>{`x${item.quantity}`}</Text>
      </View>
      <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
    </View>
  );

  const formatDate = (date) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = daysOfWeek[date.getDay()];
    const month = date.getMonth() + 1;
    const dayOfMonth = date.getDate();
    return `${day}, ${month}/${dayOfMonth}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DeliveryOptions
        deliveryMethod={deliveryMethod}
        handleDeliveryMethodChange={handleDeliveryMethodChange}
        pickupOption={pickupOption}
        setPickupOption={setPickupOption}
        pickupScheduledTime={pickupScheduledTime}
        setPickupScheduledTime={setPickupScheduledTime}
        deliveryOption={deliveryOption}
        setDeliveryOption={setDeliveryOption}
        deliveryScheduledTime={deliveryScheduledTime}
        setDeliveryScheduledTime={setDeliveryScheduledTime}
        address={address}
        handleChangeAddress={handleChangeAddress}
        handlePickupTimeChange={handlePickupTimeChange}
        handleDeliveryTimeChange={handleDeliveryTimeChange}
        currentTime={currentTime}
        formatDate={formatDate}
        scheduleTimes={scheduleTimes}
      />

      <OrderSummary
        cart={cart}
        subtotal={subtotal}
        showDeliveryFee={showDeliveryFee}
        deliveryFee={deliveryFee}
        taxes={taxes}
        totalPrice={totalPrice}
        renderOrderItem={renderOrderItem}
      />

      <TipSelector
        tipPercentage={tipPercentage}
        calculatedTip={calculatedTip}
        tipCustom={tipCustom}
        handleTipPercentageSelect={handleTipPercentageSelect}
        handleCustomTipChange={handleCustomTipChange}
      />

      <PaymentMethod
        creditCardNumber={creditCardNumber}
        setCreditCardNumber={setCreditCardNumber}
        expirationDate={expirationDate}
        setExpirationDate={setExpirationDate}
        cvv={cvv}
        setCvv={setCvv}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 22,
    marginVertical: 10,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  itemImage: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 20,
  },
  itemQuantity: {
    fontSize: 18,
    color: '#777',
  },
  itemPrice: {
    fontSize: 20,
  },
  sectionHeader: {
    fontSize: 22,
    marginTop: 20,
    marginBottom: 20,
    marginVertical: 15,
  },
  optionContainer: {
    flexDirection: 'row',
    marginTop: 10,
    height: 50,
  },
  optionText: {
    fontSize: 20,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center',
  },
  deselectedLeft: {
    backgroundColor: '#f5f5f5',
  },
  deselectedRight: {
    backgroundColor: '#f5f5f5',
  },
  selectedLeft: {
    backgroundColor: 'black',
  },
  selectedRight: {
    backgroundColor: 'black',
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  timeOptionContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  timeOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center',
  },
  deselectedTime: {
    backgroundColor: '#f5f5f5',
  },
  selectedTime: {
    backgroundColor: 'black',
  },
  timeText: {
    fontSize: 16,
  },
  timePickerRow: {
    flexDirection: 'row',
  },
  datePicker: {
    flex: 1,
  },
  timePicker: {
    flex: 1,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#f4f4f4',
    borderRadius: 5,
    marginVertical: 10,
  },
  addressIcon: {
    marginRight: 5,
    color: 'black',
  },
  addressText: {
    maxWidth: '85%',
    fontSize: 22,
    color: '#333',
    marginRight: 5,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flex: 2,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  summaryContainer: {
    marginTop: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 18,
  },
  summaryValue: {
    fontSize: 18,
  },
  creditCardForm: {
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  cardNumber: {
    marginBottom: 20,
  },
  smallInput: {
    flex: 1,
    marginRight: 10,
  },
  priceContainer: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
  },
  priceLabel: {
    fontSize: 20,
    color: '#333',
  },
  priceValue: {
    fontSize: 20,
    color: '#333',
    textAlign: 'right',
    width: 100,
  },
  tipButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  tipButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: 'black',
    borderRadius: 8,
    marginRight: 10,
  },
  tipButtonText: {
    fontSize: 16,
    color: 'white',
  },









  tipInput: {
    height: 40,                // 高度
    width: 90,                // 宽度
    borderWidth: 1,          // 边框宽度
    backgroundColor: "black",
    paddingLeft: 10,           // 左侧内边距
    paddingRight: 10,          // 右侧内边距
    paddingTop: 8,             // 上内边距，保证文字居中
    paddingBottom: 8,          // 下内边距，保证文字居中
    borderRadius: 8,           // 圆角
    marginLeft: 0,            // 左侧外边距
    color: 'white',          // 
    textAlign: 'center',
    fontSize: 15       // 设置文字居中
  },
  paymentabel: {
    fontSize: 22 
  },
  paymentValue:{
    fontSize: 24,
    fontWeight: "bold"
  }
});

export default CheckoutScreen;

