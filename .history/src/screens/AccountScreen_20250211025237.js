import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const AccountScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Information</Text>
      
      {/* Personal Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Name: <Text style={styles.infoValue}>John Doe</Text></Text>
        <Text style={styles.infoLabel}>Phone: <Text style={styles.infoValue}>+123 456 7890</Text></Text>
        <Text style={styles.infoLabel}>Email: <Text style={styles.infoValue}>john.doe@example.com</Text></Text>
      </View>

      {/* Promotions & Help Section */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => alert('Promo Clicked')}>
          <Icon name="gift" size={20} color="#fff" />
          <Text style={styles.actionText}>Promotions</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={() => alert('Help Clicked')}>
          <Icon name="question-circle" size={20} color="#fff" />
          <Text style={styles.actionText}>Help</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  infoLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  infoValue: {
    fontWeight: 'bold',
    color: '#333',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5cb85c',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default AccountScreen;
