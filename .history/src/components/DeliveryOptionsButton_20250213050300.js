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
  timeOptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeOption: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginHorizontal: 8,
  },
  selectedTime: {
    borderColor: '#000', // Selected time with black border
  },
  deselectedTime: {
    borderColor: '#ccc', // Unselected time with gray border
  },
  timeText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timeSubText: {
    fontSize: 18,
    color: '#666', // Gray font
    marginTop: 4,
  },
  timePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePicker: {
    flex: 1,
  },
  timePicker: {
    flex: 1,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  addressIcon: {
    marginRight: 8,
  },
  addressText: {
    flex: 1,
    fontSize: 16,
  },
  arrowIcon: {
    marginLeft: 8,
  },
  restaurantInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 16,
    maxWidth: 350,
  },
  storeIcon: {
    marginRight: 15,
    fontSize: 30,
  },
  restaurantDetails: {
    alignItems: 'flex-start',
  },
  restaurantName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  restaurantAddress: {
    fontSize: 22,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 16,
  },
  pickupTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'left',
    marginBottom: 26,
  },
  pickupTimeTextContainer: {
    flexDirection: 'column',
  },
  clockIcon: {
    marginRight: 15,
    fontSize: 30,
  },
  pickupTimeText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pickupTime: {
    fontSize: 22,
    color: '#666',
  },
});
export default DeliveryOptionsButton;