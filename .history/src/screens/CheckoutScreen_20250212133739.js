import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { FontAwesome } from 'react-native-vector-icons';
import { TextInput } from 'react-native';
import { generateOrderId } from '../context/OrderIdGenerator';
import OrderSummary from '../components/OrderSummary';
import TipSelector from '../components/TipSelector';  
import PaymentMethod from '../components/PaymentMethod'; 

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
const [tipCustom, setTipCustom] = useState("");         
const [tipAmount, setTipAmount] = useState(0);     
const [restaurantInfo, setRestaurantInfo] = useState(null);
const customerName = "Terry Ho"

const cart = cartItems[restaurantId] || []; 
  if (cart.length === 0) {
    return <Text>Your cart is empty</Text>;
  }
  
const handleTipPercentageSelect = (percentage) => {
  setTipPercentage(percentage);
  setTipCustom("");
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
  } else {setShowDeliveryFee(false)}
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
      const dayStart = new Date(currentTime.getTime() + (day * 24 * 60 * 60 * 1000));
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
      <Text style={styles.itemPrice}>${(item.price).toFixed(2)}</Text>
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
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.container}>
      <Text style={styles.header}>Checkout</Text>
      <Text style={styles.sectionHeader}>Delivery Method</Text>
      <View style={styles.optionContainer}>
        <TouchableOpacity
          style={[styles.option, deliveryMethod === 'pickup' ? styles.selectedLeft : styles.deselectedLeft]}
          onPress={() => handleDeliveryMethodChange('pickup')}
        >
          <Text style={[styles.optionText, deliveryMethod === 'pickup' && styles.selectedText]}>Pickup</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, deliveryMethod === 'delivery' ? styles.selectedRight : styles.deselectedRight]}
          onPress={() => handleDeliveryMethodChange('delivery')}
        >
          <Text style={[styles.optionText, deliveryMethod === 'delivery' && styles.selectedText]}>Delivery</Text>
        </TouchableOpacity>
      </View>

      {deliveryMethod === 'pickup' && (
        <View>
          <Text style={styles.sectionHeader}>Pickup Time</Text>
          <View style={styles.timeOptionContainer}>
            <TouchableOpacity
              style={[styles.timeOption, pickupOption === 'immediate' ? styles.selectedTime : styles.deselectedTime]}
              onPress={() => setPickupOption('immediate')}
            >
              <Text style={[styles.timeText, pickupOption === 'immediate' && styles.selectedText]}>Immediate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timeOption, pickupOption === 'scheduled' ? styles.selectedTime : styles.deselectedTime]}
              onPress={() => setPickupOption('scheduled')}
            >
               <Text style={[styles.timeText, pickupOption === 'scheduled' && styles.selectedText]}>Scheduled</Text>
               </TouchableOpacity>
          </View>

          {pickupOption === 'scheduled' && (
  <View>
    <Text style={styles.sectionHeader}>Select Pickup Time</Text>
    <View style={styles.timePickerRow}>
      <Picker
        selectedValue={pickupScheduledTime ? pickupScheduledTime.toLocaleDateString() : null}
        style={styles.datePicker}
        onValueChange={handlePickupTimeChange}
      >
        {Array.from({ length: 5 }, (_, i) => {
          const date = new Date(currentTime);
          date.setDate(date.getDate() + i);
          return (
            <Picker.Item key={i} label={formatDate(date)} value={date.getDate()} />
          );
        })}
      </Picker>
      <Picker
        selectedValue={pickupScheduledTime ? pickupScheduledTime.getHours() * 60 + pickupScheduledTime.getMinutes() : null}
        style={styles.timePicker}
        onValueChange={(itemValue) => {
          const newTime = pickupScheduledTime || new Date();
          newTime.setHours(Math.floor(itemValue / 60));
          newTime.setMinutes(itemValue % 60);
          setPickupScheduledTime(newTime);
        }}
      >
        {scheduleTimes.map((time, index) => (
          <Picker.Item key={index} label={time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} value={time.getHours() * 60 + time.getMinutes()} />
        ))}
      </Picker>
    </View>
  </View>
)}

        </View>
      )}

{deliveryMethod === 'delivery' && (
        <View>
          <Text style={styles.sectionHeader}>Delivery Time</Text>
          <View style={styles.timeOptionContainer}>
            <TouchableOpacity
              style={[styles.timeOption, deliveryOption === 'immediate' ? styles.selectedTime : styles.deselectedTime]}
              onPress={() => setDeliveryOption('immediate')}
            >
               <Text style={[styles.timeText, deliveryOption === 'immediate' && styles.selectedText]}>Immediate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timeOption, deliveryOption === 'scheduled' ? styles.selectedTime : styles.deselectedTime]}
              onPress={() => setDeliveryOption('scheduled')}
            >
              <Text style={[styles.timeText, deliveryOption === 'scheduled' && styles.selectedText]}>Scheduled</Text>
            </TouchableOpacity>
          </View>


          {deliveryMethod === 'delivery' && (
 <View>
 <Text style={styles.sectionHeader}>Delivery Address</Text>

 
 <View style={styles.addressBox}>

   <TouchableOpacity onPress={handleChangeAddress}// 進入 AddressPicker 頁面
   >
<View style={styles.addressBox}>
  <Icon name="location-on" size={32} color="#4CAF50" style={styles.addressIcon} />
  <Text
    style={styles.addressText}
    numberOfLines={1}
    ellipsizeMode="tail"
  >
    {address || 'Address not available'}
  </Text>
  <Icon name="keyboard-arrow-down" size={32} color="black" style={styles.arrowIcon} />
</View>
   </TouchableOpacity>
 </View>
</View>
)}
{deliveryOption === 'scheduled' && (
  <View>
    <Text style={styles.sectionHeader}>Select Delivery Time</Text>
    <Picker
      selectedValue={deliveryScheduledTime ? deliveryScheduledTime.toISOString() : null} // 使用 toISOString() 確保是字串
      style={styles.datePicker}
      onValueChange={(itemValue) => {
        const newTime = new Date(itemValue); // 將字串轉換為 Date 對象
        setDeliveryScheduledTime(newTime);
      }}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const date = new Date(currentTime);
        date.setDate(date.getDate() + i);
        return (
          <Picker.Item key={i} label={formatDate(date)} value={date.toISOString()} /> // 使用 toISOString() 確保是字串
        );
      })}
    </Picker>
    <Picker
      selectedValue={deliveryScheduledTime ? deliveryScheduledTime.toISOString() : null} // 使用 toISOString() 確保是字串
      style={styles.timePicker}
      onValueChange={(itemValue) => {
        const newTime = new Date(itemValue); // 將字串轉換為 Date 對象
        setDeliveryScheduledTime(newTime);
      }}
    >
      {scheduleTimes.map((time, index) => (
        <Picker.Item key={index} label={time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} value={time.toISOString()} /> // 使用 toISOString() 確保是字串
      ))}
    </Picker>
  </View>
)}
        </View>
      )}
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

    <View style={styles.paymentContainer}>
  <View style={styles.summaryRow}>

  <View style={styles.priceContainer}>
  <View style={styles.priceRow}>
    <Text style={styles.paymentabel}>Payment:</Text>
    <Text style={styles.paymentValue}>${(totalPrice + calculatedTip).toFixed(2)}</Text>
  </View>
  </View></View></View>

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
paymentabel: {
  fontSize: 22 
},
paymentValue:{
  fontSize: 24,
  fontWeight: "bold"
}
});

export default CheckoutScreen;

