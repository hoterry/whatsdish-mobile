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
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.container}>
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

      {/*<TipSelector
        totalPrice={totalPrice}
        onTipChange={handleTipChange}
      />

      <View style={styles.paymentContainer}>
        <View style={styles.summaryRow}>
          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text style={styles.paymentabel}>Payment:</Text>
              <Text style={styles.paymentValue}>${(totalPrice + calculatedTip).toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </View>*/}

      <Payment
        creditCardNumber={creditCardNumber}
        setCreditCardNumber={setCreditCardNumber}
        expirationDate={expirationDate}
        setExpirationDate={setExpirationDate}
        cvv={cvv}
        setCvv={setCvv}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
        <Text style={styles.placeOrderText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: '#fff',
    paddingTop: 80
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    paddingTop: 30
  },
  backIcon: {
    position: 'absolute', // 絕對定位
    top: 0, // 距離頂部 20
    left: 20, // 距離左側 20
    zIndex: 1, // 確保圖標在最上層
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
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  paymentContainer: {
    marginTop: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
  },
  paymentabel: {
    fontSize: 22,
  },
  paymentValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute', // 固定在底部
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff', // 按鈕區域的背景顏色
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd', // 添加頂部分隔線
  },
  placeOrderButton: {
    backgroundColor: '#ff6600', // 醒目的顏色
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  placeOrderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default CheckoutScreen;

