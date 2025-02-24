import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const fetchAddressSuggestions = async (query) => {
  if (!query) return [];

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.map((item) => item.display_name);
  } catch (error) {
    console.error('Error fetching address suggestions:', error);
    return [];
  }
};

function AddressPicker({ visible, onClose, onSelectAddress }) {
  const [newAddress, setNewAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (newAddress.length > 2) {
      setLoading(true);
      fetchAddressSuggestions(newAddress).then((results) => {
        setSuggestions(results);
        setLoading(false);
      });
    } else {
      setSuggestions([]);
    }
  }, [newAddress]);

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.header}>Select Your Address</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color="#888" />
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Enter new address"
              value={newAddress}
              onChangeText={setNewAddress}
            />
            {loading && <ActivityIndicator size="small" color="#888" />}
          </View>

          {suggestions.length > 0 && (
            <FlatList
              data={suggestions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onSelectAddress(item);
                    onClose();
                  }}
                >
                  <View style={styles.suggestionItem}>
                    <Text style={styles.suggestionText}>{item}</Text>
                  </View>
                </TouchableOpacity>
              )}
              style={styles.suggestionList}
            />
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-circle" size={30} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明背景
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    width: '100%',
    height: 50,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  suggestionList: {
    maxHeight: 200,
    width: '100%',
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f8f8f8',
    marginBottom: 8,
    borderRadius: 6,
    alignItems: 'flex-start',
  },
  suggestionText: {
    fontSize: 16,
    color: '#444',
  },
  closeButton: {
    marginTop: 15,
    alignItems: 'center',
  },
});

export default AddressPicker;
