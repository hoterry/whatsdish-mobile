import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DeliveryOptions = ({
  deliveryOption,
  deliveryScheduledTime,
  currentTime,
  scheduleTimes,
  onDeliveryOptionChange,
  onDeliveryTimeChange,
  formatDate,
  address,
  onAddressChange,
}) => {
  const openScheduleModal = () => {
    // Implement schedule modal opening logic for delivery if needed
  };

  return (
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
          onPress={openScheduleModal}
        >
          <Text style={styles.timeText}>Schedule</Text>
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
  
export default DeliveryOptions;
