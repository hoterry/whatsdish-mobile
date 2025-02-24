import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const ScheduleModal = ({
  isVisible,
  onClose,
  onConfirm,
  currentTime,
  scheduleTimes,
  formatDate,
}) => {
  const [selectedDate, setSelectedDate] = useState('PLEASE SELECT A DATE'); // Default string
  const [selectedTime, setSelectedTime] = useState('PLEASE SELECT A TIME'); // Default string

  useEffect(() => {
    if (isVisible) {
      setSelectedDate('PLEASE SELECT A DATE');
      setSelectedTime('PLEASE SELECT A TIME');
    }
  }, [isVisible]);

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Handle time change
  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  // Handle confirm
  const handleConfirm = () => {
    if (selectedDate !== 'PLEASE SELECT A DATE' && selectedTime !== 'PLEASE SELECT A TIME') {
      const newTime = new Date(selectedDate);
      newTime.setHours(selectedTime.getHours());
      newTime.setMinutes(selectedTime.getMinutes());
      onConfirm(newTime.toISOString());
    }
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>Set Schedule</Text>

          {/* Date Picker */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Select Date</Text>
            <Picker
              selectedValue={selectedDate}
              onValueChange={handleDateChange}
            >
              {Array.from({ length: 5 }, (_, i) => {
                const date = new Date(currentTime);
                date.setDate(date.getDate() + i);
                return (
                  <Picker.Item key={i} label={formatDate(date)} value={date.toISOString()} />
                );
              })}
              <Picker.Item label="PLEASE SELECT A DATE" value="PLEASE SELECT A DATE" />
            </Picker>
          </View>

          {/* Time Picker */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Select Time</Text>
            <Picker
              selectedValue={selectedTime}
              onValueChange={handleTimeChange}
            >
              {scheduleTimes.map((time, index) => (
                <Picker.Item
                  key={index}
                  label={time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  value={time.toISOString()}
                />
              ))}
              <Picker.Item label="PLEASE SELECT A TIME" value="PLEASE SELECT A TIME" />
            </Picker>
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
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
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScheduleModal;
