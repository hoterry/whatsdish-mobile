import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View, Modal } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import AddressPicker from '../components/AddressPicker';

const LocationFetcher = ({ onLocationFetched }) => {
  const [location, setLocation] = useState('Fetching location...');
  const [loading, setLoading] = useState(true);
  const [isPickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation('Permission denied');
        setLoading(false);
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      const results = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      if (results.length > 0) {
        const { city, region, country, street, name } = results[0];
        const userLocation = `${name ? name + ', ' : ''}${city}, ${region}, ${country}`;
        setLocation(userLocation);
        onLocationFetched(userLocation);
      } else {
        setLocation('No address found');
      }
      setLoading(false);
    };

    fetchLocation();
  }, []);

  const handleAddressSelected = (selectedAddress) => {
    setLocation(selectedAddress);
    onLocationFetched(selectedAddress);
    setPickerVisible(false);
  };

  return (
    <View>
      <TouchableOpacity style={styles.locationContainer} onPress={() => setPickerVisible(true)}>
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <>
            <Text style={styles.locationText} numberOfLines={1}>
              {location}
            </Text>
            <Ionicons name="chevron-down-outline" size={16} color="black" />
          </>
        )}
      </TouchableOpacity>

      <Modal visible={isPickerVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <AddressPicker onSelectAddress={handleAddressSelected} onClose={() => setPickerVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  locationText: {
    fontSize: 16,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LocationFetcher;
