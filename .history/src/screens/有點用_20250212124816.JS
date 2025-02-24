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

          const orderData = {
            user_id: "9913120",
            order_id: generateOrderId(), // 假设有一个生成唯一订单ID的函数
            order_type: deliveryMethod === 'delivery' ? 'Delivery' : 'Pick Up',
            customer_name: customerName, // 顾客姓名
            customer_address: deliveryMethod === 'delivery' ? address : null, // 送餐需要地址
            restaurant: restaurantInfo ? restaurantInfo.name : 'Unknown Restaurant', // 确保有值
            restaurant_address: restaurantInfo ? restaurantInfo.address : 'Unknown Address', // 确保有值
            items: JSON.stringify(cart), // 商品列表，存为 JSON 字符串
            order_status: "Pending",
            delivery_fee: parseFloat(deliveryFee.toFixed(2)), // 配送费用
            taxes: parseFloat(taxes.toFixed(2)), // 税费
            subtotal: parseFloat(subtotal.toFixed(2)), // 商品总价
            tips: parseFloat(calculatedTip.toFixed(2)), // 小费
            total_price: parseFloat((totalPrice + calculatedTip + deliveryFee + taxes).toFixed(2)), // 总金额
            delivery_time: deliveryMethod === 'delivery' 
              ? new Date(new Date().getTime() + 30 * 60 * 1000).toISOString() // 硬编码当前时间作为配送时间
              : null, 
            pickup_time: deliveryMethod === 'pickup' 
              ? new Date(new Date().getTime() + 30 * 60 * 1000).toISOString() // 硬编码当前时间 +30分钟
              : null,
            created_at: new Date().toISOString(), // 订单创建时间
          };

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