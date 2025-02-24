import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Picker, StyleSheet } from 'react-native';
import { Icon } from 'react-native-vector-icons/MaterialIcons';

const DeliveryOptions = ({
  deliveryMethod,
  handleDeliveryMethodChange,
  pickupOption,
  setPickupOption,
  pickupScheduledTime,
  setPickupScheduledTime,
  deliveryOption,
  setDeliveryOption,
  deliveryScheduledTime,
  setDeliveryScheduledTime,
  address,
  handleChangeAddress,
  handlePickupTimeChange,
  handleDeliveryTimeChange,
  currentTime,
  formatDate,
  scheduleTimes,
}) => {
  return (
    <View>
      <Text style={styles.sectionHeader}>Delivery Method</Text>
      <View style={styles.optionContainer}>
        <TouchableOpacity
          style={[styles.option, deliveryMethod === 'pickup' ? styles.selectedLeft : styles.deselectedLeft]}
          onPress={() => handleDeliveryMethodChange('pickup')}
        >
          <Text style={[styles.optionText, deliveryMethod === 'pickup' && styles.selectedText]}>Pickup</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, deliveryMethod === 'delivery' ? styles.selectedRight : styles.deselectedRight]}
          onPress={() => handleDeliveryMethodChange('delivery')}
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
              onPress={() => setPickupOption('immediate')}
            >
              <Text style={[styles.timeText, pickupOption === 'immediate' && styles.selectedText]}>Immediate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timeOption, pickupOption === 'scheduled' ? styles.selectedTime : styles.deselectedTime]}
              onPress={() => setPickupOption('scheduled')}
            >
              <Text style={[styles.timeText, pickupOption === 'scheduled' && styles.selectedText]}>Scheduled</Text>
            </TouchableOpacity>
          </View>

          {pickupOption === 'scheduled' && (
            <View>
              <Text style={styles.sectionHeader}>Select Pickup Time</Text>
              <View style={styles.timePickerRow}>
                <Picker
                  selectedValue={pickupScheduledTime ? pickupScheduledTime.toLocaleDateString() : null}
                  style={styles.datePicker}
                  onValueChange={handlePickupTimeChange}
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const date = new Date(currentTime);
                    date.setDate(date.getDate() + i);
                    return (
                      <Picker.Item key={i} label={formatDate(date)} value={date.getDate()} />
                    );
                  })}
                </Picker>
                <Picker
                  selectedValue={pickupScheduledTime ? pickupScheduledTime.getHours() * 60 + pickupScheduledTime.getMinutes() : null}
                  style={styles.timePicker}
                  onValueChange={(itemValue) => {
                    const newTime = pickupScheduledTime || new Date();
                    newTime.setHours(Math.floor(itemValue / 60));
                    newTime.setMinutes(itemValue % 60);
                    setPickupScheduledTime(newTime);
                  }}
                >
                  {scheduleTimes.map((time, index) => (
                    <Picker.Item key={index} label={time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} value={time.getHours() * 60 + time.getMinutes()} />
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
              onPress={() => setDeliveryOption('immediate')}
            >
              <Text style={[styles.timeText, deliveryOption === 'immediate' && styles.selectedText]}>Immediate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timeOption, deliveryOption === 'scheduled' ? styles.selectedTime : styles.deselectedTime]}
              onPress={() => setDeliveryOption('scheduled')}
            >
              <Text style={[styles.timeText, deliveryOption === 'scheduled' && styles.selectedText]}>Scheduled</Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.sectionHeader}>Delivery Address</Text>
            <View style={styles.addressBox}>
              <TouchableOpacity onPress={handleChangeAddress}>
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
                selectedValue={deliveryScheduledTime ? deliveryScheduledTime.toLocaleDateString() : null}
                style={styles.datePicker}
                onValueChange={handleDeliveryTimeChange}
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const date = new Date(currentTime);
                  date.setDate(date.getDate() + i);
                  return (
                    <Picker.Item key={i} label={formatDate(date)} value={date.getDate()} />
                  );
                })}
              </Picker>
              <Picker
                selectedValue={deliveryScheduledTime ? deliveryScheduledTime.getHours() * 60 + deliveryScheduledTime.getMinutes() : null}
                style={styles.timePicker}
                onValueChange={(itemValue) => {
                  const newTime = deliveryScheduledTime || new Date();
                  newTime.setHours(Math.floor(itemValue / 60));
                  newTime.setMinutes(itemValue % 60);
                  setDeliveryScheduledTime(newTime);
                }}
              >
                {scheduleTimes.map((time, index) => (
                  <Picker.Item key={index} label={time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} value={time.getHours() * 60 + time.getMinutes()} />
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
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
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  selectedRight: {
    backgroundColor: '#4CAF50',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  deselectedRight: {
    backgroundColor: '#f5f5f5',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
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
    marginHorizontal: 4,
  },
  selectedTime: {
    backgroundColor: '#4CAF50',
  },
  deselectedTime: {
    backgroundColor: '#f5f5f5',
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePicker: {
    flex: 1,
    marginRight: 8,
  },
  timePicker: {
    flex: 1,
    marginLeft: 8,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
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