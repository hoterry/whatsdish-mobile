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
      selectedValue={deliveryScheduledTime ? deliveryScheduledTime.toLocaleDateString() : null}
      style={styles.datePicker}
      onValueChange={handleDeliveryTimeChange}
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
      selectedValue={deliveryScheduledTime ? deliveryScheduledTime.getHours() * 60 + deliveryScheduledTime.getMinutes() : null}
      style={styles.timePicker}
      onValueChange={(itemValue) => {
        const newTime = deliveryScheduledTime || new Date();
        newTime.setHours(Math.floor(itemValue / 60));
        newTime.setMinutes(itemValue % 60);
        setDeliveryScheduledTime(newTime);
      }}
    >
      {scheduleTimes.map((time, index) => (
        <Picker.Item key={index} label={time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} value={time.getHours() * 60 + time.getMinutes()} />
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
        <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>
          Tip {tipPercentage > 0 ? `(${tipPercentage}%)` : '(Custom):'}
        </Text>
        <Text style={styles.priceValue}>${calculatedTip.toFixed(2)}</Text>
      </View>
    <View style={styles.tipButtonsContainer}>
      <TouchableOpacity onPress={() => handleTipPercentageSelect(10)} style={styles.tipButton}>
        <Text style={styles.tipButtonText}>10%</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleTipPercentageSelect(15)} style={styles.tipButton}>
        <Text style={styles.tipButtonText}>15%</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleTipPercentageSelect(20)} style={styles.tipButton}>
        <Text style={styles.tipButtonText}>20%</Text>        
      </TouchableOpacity>
          <TextInput
        style={styles.tipInput}
        placeholder ="Custom Tip$ "
        keyboardType="numeric"
        placeholderTextColor="#ffffff"
        value={tipCustom}
        textAlign="center"
        onChangeText={handleCustomTipChange}
      />
    </View>
    <View style={styles.paymentContainer}>
  <View style={styles.summaryRow}>

  <View style={styles.priceContainer}>
  <View style={styles.priceRow}>
    <Text style={styles.paymentabel}>Payment:</Text>
    <Text style={styles.paymentValue}>${(totalPrice + calculatedTip).toFixed(2)}</Text>
  </View>
  </View></View></View>

      <View>
  <Text style={styles.sectionHeader}>Payment Method</Text>
  <View style={styles.paymentMethodContainer}>
    <View style={styles.paymentOptions}>
      <TouchableOpacity style={styles.paymentOption}>
        <FontAwesome name="cc-visa" size={40} color="#1a73e8" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.paymentOption}>
        <FontAwesome name="cc-mastercard" size={40} color="#f79e1b" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.paymentOption}>
        <FontAwesome name="cc-paypal" size={40} color="#003087" />
      </TouchableOpacity>
    </View>
  </View>
</View>
      <Text style={styles.sectionHeader}>Credit Card Details</Text>
      <View style={styles.creditCardForm}>
      <TextInput
          style={[styles.input, styles.cardNumber]}
          placeholder="Credit Card Number"
          keyboardType="numeric"
          value={creditCardNumber}
          onChangeText={setCreditCardNumber}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.smallInput]}
            placeholder="MM/YY"
            keyboardType="numeric"
            value={expirationDate}
            onChangeText={setExpirationDate}
          />
          <TextInput
            style={[styles.input, styles.smallInput]}
            placeholder="CVV"
            keyboardType="numeric"
            value={cvv}
            onChangeText={setCvv}
          />
        </View> 
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    
  container: {
    padding: 20,
    backgroundColor: "#fff"
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
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Aligns the content to the right side of the screen
    marginTop: 20, // Optional: space from the previous content
    marginBottom: 20, // Optional: space from the bottom of the screen
  },
  totalPrice: {
    fontSize: 20,
    marginBottom: 5,
    
  },
  totalInfo: {
    alignItems: 'flex-end', // Align text to the right in the container
  },
  totalItems: {
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
    height: 50
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
  submitButton: {
    backgroundColor: '#000000',  // 按钮背景色
    paddingVertical: 15,  // 上下内边距
    paddingHorizontal: 30,  // 左右内边距
    borderRadius: 25,  // 圆角效果
    marginTop: 20,  // 与其他元素的间距
    alignItems: 'center',  // 居中文本
    justifyContent: 'center',  // 垂直居中文本
    shadowColor: '#000',  // 阴影颜色
    shadowOffset: { width: 0, height: 4 },  // 阴影的偏移量
    shadowOpacity: 0.3,  // 阴影的透明度
    shadowRadius: 6,  // 阴影的半径
    elevation: 5,  // Android 上的阴影效果
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 25,
  },
  addressBox: {
    flexDirection: 'row', // 水平排列
    alignItems: 'center', // 垂直居中對齊
    padding: 5,
    backgroundColor: '#f4f4f4', // 可根據需要修改背景色
    borderRadius: 5,
    marginVertical: 10,
  },
  addressIcon: {
    marginRight: 5, // 設定圖示和地址之間的間距
    color: 'black', // 可根據需要修改背景色
  },
  addressText: {
    maxWidth: '85%', // 限制文本宽度
    fontSize: 22,
    color: '#333',
    marginRight: 5,
  },
  
  paymentOptionContainer: {
    marginVertical: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  
  paymentIcon: {
    marginRight: 10,
  },
  
  paymentText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },  
  paymentMethodText: {
    flex: 1, // 文字占据剩余空间
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },  paymentOptions: {
    flexDirection: 'row', // 横向布局
    justifyContent: 'space-evenly', // 均匀分布
    flex: 2, // 图标部分占据更多空间
  },

  scrollContainer:{
    flexGrow: 1,  // 确保 ScrollView 的内容能展开填满整个屏幕
    paddingBottom: 100, 
    
  }, summaryContainer: {
    marginTop: 20,

  },summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10, // 確保行與行之間有間距
  }, summaryText: {
    fontSize: 18,

  },summaryValue: {
    fontSize: 18,

  },creditCardForm: {
    marginBottom: 30,
  },input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 10,
    fontSize: 16,
  },cardNumber: {
    marginBottom: 20,
  },smallInput: {
    flex: 1,
    marginRight: 10,
  },button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },   
  priceContainer: {
    marginTop: 20,
    alignItems: 'flex-end', // 让所有的价格项对齐到右边
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // 标签和价格分布两侧
    marginBottom: 10,
    width: '100%', // 保证行宽度是100%
  },
  priceLabel: {
    fontSize: 20,
    color: '#333',
  },
  priceValue: {
    fontSize: 20,
    color: '#333',
    textAlign: 'right', // 价格右对齐
    width: 100, // 确保价格的宽度一致并对齐
  },
  totalLabel: {
    fontWeight: 'bold', // "Total" 使用加粗样式
  },
  totalValue: {
    fontWeight: 'bold', // 总价格加粗
  },
  tipButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',  // 使按钮和输入框均匀分布
    alignItems: 'center',  // 确保按钮和输入框垂直居中对齐
    marginBottom: 15,
  },
  tipButton: {

    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: 'black',
    borderRadius: 8,
    marginRight: 10,  // 为按钮间增加间隔
  },
  tipButtonText: {
    fontSize: 16,
    color:"white", 
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

