import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

const ScheduleModal = ({ isVisible, onClose, onConfirm, currentTime }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [timeOptions, setTimeOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (isVisible) {
      fetchOrderId();
    }
  }, [isVisible]);

  const fetchOrderId = async () => {
    try {
      const storedOrderId = await SecureStore.getItemAsync('order_id');
      console.log('[ScheduleModal Log] Fetched orderId from SecureStore:', storedOrderId);
      if (storedOrderId) {
        setOrderId(storedOrderId);
      } else {
        console.warn('[ScheduleModal Warning] No orderId found in SecureStore');
      }
    } catch (error) {
      console.error('[ScheduleModal Error] Failed to fetch orderId:', error);
    }
  };

  useEffect(() => {
    if (!isVisible) return;
    const dates = generateDateOptions();
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!selectedDate || !orderId) return;
    fetchAvailableTimes();
  }, [selectedDate, orderId]);

  const fetchAvailableTimes = async () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    setLoading(true);
    try {
      const response = await fetch(
        `https://dev.whatsdish.com/api/orders/${orderId}/schedule-list?mode=pickup&date=${dateStr}`
      );

      console.log('[ScheduleModal Log] Response status:', response.status);

      const result = await response.json();
      console.log('[ScheduleModal Log] Fetched schedule data:', JSON.stringify(result, null, 2));

      const slots = result.slots || [];
      const startTimes = slots.map(slot => slot.st);

      setTimeOptions(startTimes);
      setSelectedTime(startTimes[0] || null);
    } catch (error) {
      console.error('[ScheduleModal Error] Failed to fetch schedule:', error);
      setTimeOptions([]);
      setSelectedTime(null);
    }
    setLoading(false);
  };

  const generateDateOptions = () => {
    const dates = [];
    const today = new Date(currentTime || new Date());
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      const selectedDateTime = new Date(selectedDate);
      let timeStr = selectedTime.toLowerCase().replace(/\s/g, '');
      let [time, period] = timeStr.split(/(am|pm)/);
      let [hour, minute] = time.split(':');
      hour = parseInt(hour);
      if (period === 'pm' && hour !== 12) hour += 12;
      if (period === 'am' && hour === 12) hour = 0;
      selectedDateTime.setHours(hour, minute);
      selectedDateTime.setSeconds(0);

      console.log('[ScheduleModal Log] Confirming:', selectedDateTime.toISOString());
      onConfirm(selectedDateTime.toISOString());
      onClose();
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="black" />
          </TouchableOpacity>

          <Text style={styles.title}>Set Schedule</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateScrollContainer}
          >
            {generateDateOptions().map((date, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateOption,
                  selectedDate?.toDateString() === date.toDateString() && styles.selectedDateOption,
                ]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={styles.weekdayText}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </Text>
                <Text style={styles.dateText}>
                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView style={styles.timePicker}>
            {loading ? (
              <ActivityIndicator size="large" color="black" />
            ) : timeOptions.length > 0 ? (
              timeOptions.map((time, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.timeOption, selectedTime === time && styles.selectedTimeOption]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[styles.timeText, selectedTime === time && styles.selectedTimeText]}>{time}</Text>
                  <View style={[styles.radio, selectedTime === time && styles.selectedRadio]} />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noSlotsText}>No available slots</Text>
            )}
          </ScrollView>

          <TouchableOpacity
            style={[styles.confirmButton, (!selectedDate || !selectedTime) && styles.disabledButton]}
            onPress={handleConfirm}
            disabled={!selectedDate || !selectedTime}
          >
            <Text style={styles.confirmButtonText}>Set Schedule</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};



const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    paddingTop: 50,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center', 
    marginBottom: 16,
  },
  dateScrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  dateOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 10,
    width: 110,
    height: 80,
  },
  selectedDateOption: {
    borderColor: 'black',
  },
  weekdayText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 18,
    color: '#777',
  },
  timePicker: {
    maxHeight: 350,
    marginVertical: 20
  },
  timeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  selectedTimeOption: {
    backgroundColor: '#f0f0f0',
  },
  timeText: {
    fontSize: 20, 
    color: '#333', 
  },
  selectedTimeText: {
    fontSize: 20,
    fontWeight: 'bold', 
    color: '#333', 
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#777',
  },
  selectedRadio: {
    borderColor: 'black',
    backgroundColor: 'black',
  },
  confirmButton: {
    backgroundColor: '#444',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ScheduleModal;
