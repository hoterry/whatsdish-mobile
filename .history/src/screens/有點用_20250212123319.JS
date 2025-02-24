const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `ORD-${timestamp}-${random}`; 
};


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }
      let locationData = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = locationData.coords;
      setLocation({ latitude, longitude });

      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geocode.length > 0) {
        const { street, streetNumber, city } = geocode[0];
        const detailedAddress = `${streetNumber ? streetNumber + ' ' : ''}${street || ''}, ${city || ''}`;
        setAddress(detailedAddress);
      }
    })();
  }, []);



  
    const handleOrderSubmit = () => {
      let timeMessage;
    
      if (deliveryMethod === 'delivery') {
        if (deliveryOption === 'scheduled' && !deliveryScheduledTime) {
          Alert.alert('Error', 'Please select a delivery time.');
          return;
        }
    
        timeMessage =
          deliveryOption === 'immediate'
            ? `Your order will arrive between ${new Date(
                currentTime.getTime() + 45 * 60000
              ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} and ${new Date(
                currentTime.getTime() + 60 * 60000
              ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}.`
            : `Your order is scheduled for ${deliveryScheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}.`;
      } else if (deliveryMethod === 'pickup') {
        if (pickupOption === 'scheduled' && !pickupScheduledTime) {
          Alert.alert('Error', 'Please select a pickup time.');
          return;
        }
        timeMessage =
          pickupOption === 'immediate'
            ? `Your pickup time will be between ${new Date(
                currentTime.getTime() + 45 * 60000
              ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} and ${new Date(
                currentTime.getTime() + 60 * 60000
              ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}.`
            : `Your pickup is scheduled for ${pickupScheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}.`;
      }
  
  
      console.log('Order Data on checkoutttttttt:', orderData);
      Alert.alert(
        'Payment Successful',
        `Your order has been placed successfully!, ${timeMessage}`,
        [
          {
            text: 'OK',
            onPress: () => {
              
              console.log('Order Data on checkoutttttttt:', orderData); // Now you can log
              clearCart();
  
              console.log('Order Data on checkoutttttttt:', orderData); // Now you can log
              navigation.navigate('OrderStatusScreen', { orderData });  // 传递所有订单数据
            },
          },
        ],
        { cancelable: false }
      );
    };
    

    
        <TouchableOpacity style={styles.submitButton} onPress={handleOrderSubmit}>
          <Text style={styles.submitButtonText}>Submit Order</Text>
        </TouchableOpacity>