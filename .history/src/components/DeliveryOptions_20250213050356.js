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

export default DeliveryOptions;
