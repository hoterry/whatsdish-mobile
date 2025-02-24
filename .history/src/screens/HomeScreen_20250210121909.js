import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 模拟的餐厅数据
const restaurants = [
  {
    id: '1',
    name: 'Pizza Hut',
    description: 'Best pizza in town!',
    image: 'https://cdn.vox-cdn.com/thumbor/fynBODjeYaTu7D07ORDrmkl8Wpw=/0x0:2300x1533/1200x900/filters:focal(966x583:1334x951)/cdn.vox-cdn.com/uploads/chorus_image/image/66041801/goldenparamount_groupshot1.0.0.jpg',
  },
  {
    id: '2',
    name: 'Burger King',
    description: 'Delicious burgers!',
    image: 'https://media.timeout.com/images/105824547/750/562/image.jpg',
  },
  {
    id: '3',
    name: 'Sushi World',
    description: 'Fresh sushi every day!',
    image: 'https://teamnutrition.ca/sites/default/files/articles/D9%20Image%20en-t%C3%AAte%20articles%20%28t%C3%A9l%C3%A9charger%20%C3%A0%2090%25%20jpeg%29%20%2810%29_0.jpg',
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Peaches Delivery</Text>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.restaurantCard}
            onPress={() => navigation.navigate('Details', { restaurant: item })}
          >
            <Image source={{ uri: item.image }} style={styles.restaurantImage} />
            <Text style={styles.restaurantName}>{item.name}</Text>
            <Text style={styles.restaurantDescription}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  restaurantCard: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  restaurantImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  restaurantDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});
