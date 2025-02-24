import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const RestaurantMenu = ({ restaurant, menu, onAddToCart, onPress }) => (
  <View style={styles.container}>
    {/* 渲染餐厅头部信息 */}
    <View style={styles.headerContainer}>
      <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
      <View style={styles.logoContainer}>
        {restaurant.logo && <Image source={{ uri: restaurant.logo }} style={styles.restaurantLogo} />}
      </View>
      <View style={styles.leftAlignContainer}>
        {restaurant.name && <Text style={styles.headerLeft}>{restaurant.name}</Text>}
        {restaurant.address && <Text style={styles.addressLeft}>{restaurant.address}</Text>}
      </View>
    </View>

    {/* 渲染菜单 */}
    {menu.map((section) => (
      <View key={section.category}>
        <Text style={styles.categoryHeader}>{section.category}</Text>
        {section.data.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => onPress(item)} style={styles.menuItem}>
            <Image source={{ uri: item.image }} style={styles.menuImage} />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuName}>{item.name}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
              <Text style={styles.menuPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={() => onAddToCart(item)}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  restaurantImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  logoContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  restaurantLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  leftAlignContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  headerLeft: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addressLeft: {
    fontSize: 16,
    color: '#555',
  },
  categoryHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  menuName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  menuPrice: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  addButton: {
    backgroundColor: '#ff6600',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RestaurantMenu;
