import React, { useState, useEffect, useContext } from 'react'; 
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import PickupOptions from './PickupOptions';
import DeliveryOptions from './DeliveryOptions';

const DeliveryOptionsButton = ({
  deliveryMethod,
  pickupOption,
  pickupScheduledTime,
  deliveryOption,
  deliveryScheduledTime,
  address,
  currentTime,
  scheduleTimes,
  onDeliveryMethodChange,
  onPickupOptionChange,
  onPickupTimeChange,
  onDeliveryOptionChange,
  onDeliveryTimeChange,
  onAddressChange,
  formatDate,
}) => {
  return (
    <View>
      <View style={styles.optionContainer}>
        <TouchableOpacity
          style={[styles.option, deliveryMethod === 'pickup' ? styles.selectedLeft : styles.deselectedLeft]}
          onPress={() => onDeliveryMethodChange('pickup')}
        >
          <Text style={[styles.optionText, deliveryMethod === 'pickup' && styles.selectedText]}>Pickup</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, deliveryMethod === 'delivery' ? styles.selectedRight : styles.deselectedRight]}
          onPress={() => onDeliveryMethodChange('delivery')}
        >
          <Text style={[styles.optionText, deliveryMethod === 'delivery' && styles.selectedText]}>Delivery</Text>
        </TouchableOpacity>
      </View>

      {deliveryMethod === 'pickup' && (
        <PickupOptions
          pickupOption={pickupOption}
          pickupScheduledTime={pickupScheduledTime}
          currentTime={currentTime}
          scheduleTimes={scheduleTimes}
          onPickupOptionChange={onPickupOptionChange}
          onPickupTimeChange={onPickupTimeChange}
          formatDate={formatDate}
        />
      )}

      {deliveryMethod === 'delivery' && (
        <DeliveryOptions
          deliveryOption={deliveryOption}
          deliveryScheduledTime={deliveryScheduledTime}
          currentTime={currentTime}
          scheduleTimes={scheduleTimes}
          onDeliveryOptionChange={onDeliveryOptionChange}
          onDeliveryTimeChange={onDeliveryTimeChange}
          formatDate={formatDate}
          address={address}
          onAddressChange={onAddressChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  option: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedLeft: {
    backgroundColor: '#4CAF50',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  deselectedLeft: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  selectedRight: {
    backgroundColor: '#4CAF50',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  deselectedRight: {
    backgroundColor: '#fff',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  optionText: {
    fontSize: 16,
  },
  selectedText: {
    color: '#fff',
  },
});

export default DeliveryOptionsButton;
