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