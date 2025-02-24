import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';

const DeliveryOptions = ({
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
      <Text style={styles.sectionHeader}>Delivery Method</Text>
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
        <View>
          <Text style={styles.sectionHeader}>Pickup Time</Text>
          <View style={styles.timeOptionContainer}>
            <TouchableOpacity
              style={[styles.timeOption, pickupOption === 'immediate' ? styles.selectedTime : styles.deselectedTime]}
              onPress={() => onPickupOptionChange('immediate')}
            >
              <Text style={[styles.timeText, pickupOption === 'immediate' && styles.selectedText]}>Immediate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timeOption, pickupOption === 'scheduled' ? styles.selectedTime : styles.deselectedTime]}
              onPress={() => onPickupOptionChange('scheduled')}
            >
              <Text style={[styles.timeText, pickupOption === 'scheduled' && styles.selectedText]}>Scheduled</Text>
            </TouchableOpacity>
          </View>

          {pickupOption === 'scheduled' && (
            <View>
              <Text style={styles.sectionHeader}>Select Pickup Time</Text>
              <View style={styles.timePickerRow}>
                <Picker
                  selectedValue={pickupScheduledTime ? pickupScheduledTime.toISOString() : null}
                  style={styles.datePicker}
                  onValueChange={onPickupTimeChange}
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const date = new Date(currentTime);
                    date.setDate(date.getDate() + i);
                    return (
                      <Picker.Item key={i} label={formatDate(date)} value={date.toISOString()} />
                    );
                  })}
                </Picker>
                <Picker
                  selectedValue={pickupScheduledTime ? pickupScheduledTime.toISOString() : null}
                  style={styles.timePicker}
                  onValueChange={onPickupTimeChange}
                >
                  {scheduleTimes.map((time, index) => (
                    <Picker.Item key={index} label={time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} value={time.toISOString()} />
                  ))}
                </Picker>
              </View>
            </View>
          )}
        </View>
      )}

      {deliveryMethod === 'delivery' && (
        <View>
          <Text style={styles.sectionHeader}>Delivery Time</Text>
          <View style={styles.timeOptionContainer}>
            <TouchableOpacity
              style={[styles.timeOption, deliveryOption === 'immediate' ? styles.selectedTime : styles.deselectedTime]}
              onPress={() => onDeliveryOptionChange('immediate')}
            >
              <Text style={[styles.timeText, deliveryOption === 'immediate' && styles.selectedText]}>Immediate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timeOption, deliveryOption === 'scheduled' ? styles.selectedTime : styles.deselectedTime]}
              onPress={() => onDeliveryOptionChange('scheduled')}
            >
              <Text style={[styles.timeText, deliveryOption === 'scheduled' && styles.selectedText]}>Scheduled</Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.sectionHeader}>Delivery Address</Text>
            <View style={styles.addressBox}>
              <TouchableOpacity onPress={onAddressChange}>
                <View style={styles.addressBox}>
                  <Icon name="location-on" size={32} color="#4CAF50" style={styles.addressIcon} />
                  <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="tail">
                    {address || 'Address not available'}
                  </Text>
                  <Icon name="keyboard-arrow-down" size={32} color="black" style={styles.arrowIcon} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {deliveryOption === 'scheduled' && (
            <View>
              <Text style={styles.sectionHeader}>Select Delivery Time</Text>
              <Picker
                selectedValue={deliveryScheduledTime ? deliveryScheduledTime.toISOString() : null}
                style={styles.datePicker}
                onValueChange={onDeliveryTimeChange}
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const date = new Date(currentTime);
                  date.setDate(date.getDate() + i);
                  return (
                    <Picker.Item key={i} label={formatDate(date)} value={date.toISOString()} />
                  );
                })}
              </Picker>
              <Picker
                selectedValue={deliveryScheduledTime ? deliveryScheduledTime.toISOString() : null}
                style={styles.timePicker}
                onValueChange={onDeliveryTimeChange}
              >
                {scheduleTimes.map((time, index) => (
                  <Picker.Item key={index} label={time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} value={time.toISOString()} />
                ))}
              </Picker>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  },
  selectedTime: {
    backgroundColor: '#4CAF50',
  },
  deselectedTime: {
    backgroundColor: '#fff',
  },
  timeText: {
    fontSize: 16,
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
});

export default DeliveryOptions;