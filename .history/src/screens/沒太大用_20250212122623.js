useEffect(() => {
  console.log('restaurantIdddddddddddddddddddddddddd:', restaurantId);
  console.log('restaurandddddddddddddddddddddddddddts:', restaurants);
  const foundRestaurant = restaurants.find((restaurant) => restaurant.restaurant_id === restaurantId);

  if (foundRestaurant) {
    setRestaurantInfo({
      name: foundRestaurant.name,
      address: foundRestaurant.address
    });
    console.log('restaurantIdddddddddddddddddddddddddd:', restaurantInfo);
    console.log('restaurandddddddddddddddddddddddddddts:', restaurantInfo);
  } else {
    console.log('Restaurant not found');
  }
}, [restaurantId, restaurants]);  


useEffect(() => {
  console.log('Received restaurants data:', restaurants); 
}, [restaurants]); 

const cart = cartItems[restaurantId] || []; 
  if (cart.length === 0) {
    return <Text>Your cart is empty</Text>;
  }

useEffect(() => {
  if (restaurantId && restaurantId.address) {
    setRestaurantAddress(restaurantId.address); // 设置餐厅地址
  }
}, [restaurantId]);