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
  initialDateTime, // The previously selected date and time passed as a prop
}) => {
  const [selectedDate, setSelectedDate] = useState(''); // Initialize as empty string
  const [selectedTime, setSelectedTime] = useState(null); // Initialize as null to ensure it's a Date object

  // Effect to set initial values when modal becomes visible
  useEffect(() => {
    if (isVisible && initialDateTime) {
      // Set the selected date and time from initialDateTime
      setSelectedDate(initialDateTime.date); // Retain the previously selected date
      setSelectedTime(new Date(initialDateTime.time)); // Retain the previously selected time
    } else if (isVisible) {
      // Reset if no initial date and time
      setSelectedDate('');
      setSelectedTime(null);
    }
  }, [isVisible, initialDateTime]);

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Handle time change
  const handleTimeChange = (time) => {
    const selected = new Date(time); // Ensure selected time is a Date object
    if (!isNaN(selected)) {
      setSelectedTime(selected);
    } else {
      console.error('Invalid Time selected');
    }
  };

  // Handle confirm
  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      const newTime = new Date(selectedDate);
      newTime.setHours(selectedTime.getHours());
      newTime.setMinutes(selectedTime.getMinutes());

      // Check if the new date is valid
      if (!isNaN(newTime)) {
        onConfirm(newTime.toISOString()); // Send the confirmed time as ISO string
      } else {
        console.error('Invalid Date or Time');
      }
    } else {
      console.error('Please select both a date and a time.');
    }
    onClose(); // Close the modal after confirming
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
              {/* Move "Select a Date" to the top */}
              <Picker.Item label="Please Select a Date" value="" />
              {Array.from({ length: 5 }, (_, i) => {
                const date = new Date(currentTime);
                date.setDate(date.getDate() + i);
                return (
                  <Picker.Item key={i} label={formatDate(date)} value={date.toISOString()} />
                );
              })}
            </Picker>
          </View>

          {/* Time Picker */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Select Time</Text>
            <Picker
              selectedValue={selectedTime ? selectedTime.toISOString() : ''}
              onValueChange={handleTimeChange}
            >
              {/* Move "Select a Time" to the top */}
              <Picker.Item label="Please Select a Time" value="" />
              {scheduleTimes.map((time, index) => (
                <Picker.Item
                  key={index}
                  label={time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  value={time.toISOString()}
                />
              ))}
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