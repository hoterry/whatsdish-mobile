import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import ModalSelector from 'react-native-modal-selector'; // 引入新的选择器

const ScheduleModal = ({
  isVisible,
  onClose,
  onConfirm,
  currentTime,
  scheduleTimes,
  formatDate,
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    if (isVisible) {
      setSelectedDate('');
      setSelectedTime(null);
    }
  }, [isVisible]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time) => {
    const selected = new Date(time);
    if (!isNaN(selected)) {
      setSelectedTime(selected);
    } else {
      console.error('Invalid Time selected');
    }
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      const newTime = new Date(selectedDate);
      newTime.setHours(selectedTime.getHours());
      newTime.setMinutes(selectedTime.getMinutes());

      if (!isNaN(newTime)) {
        onConfirm(newTime.toISOString());
      } else {
        console.error('Invalid Date or Time');
      }
    } else {
      console.error('Please select both a date and a time.');
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

          {/* Date Selector */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Select Date</Text>
            <ModalSelector
              data={Array.from({ length: 5 }, (_, i) => {
                const date = new Date(currentTime);
                date.setDate(date.getDate() + i);
                return { key: date.toISOString(), label: formatDate(date) };
              })}
              initValue="Please Select a Date"
              onChange={(option) => handleDateChange(option.key)}
            >
              <View style={styles.picker}>
                <Text style={styles.pickerItem}>
                  {selectedDate ? formatDate(new Date(selectedDate)) : 'Please Select a Date'}
                </Text>
              </View>
            </ModalSelector>
          </View>

          {/* Time Selector */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Select Time</Text>
            <ModalSelector
              data={scheduleTimes.map((time, index) => ({
                key: time.toISOString(),
                label: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }))}
              initValue="Please Select a Time"
              onChange={(option) => handleTimeChange(option.key)}
            >
              <View style={styles.picker}>
                <Text style={styles.pickerItem}>
                  {selectedTime
                    ? selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : 'Please Select a Time'}
                </Text>
              </View>
            </ModalSelector>
          </View>

          {/* Confirm and Cancel Buttons */}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  pickerContainer: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#555',
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItem: {
    fontSize: 16,
    padding: 10,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScheduleModal;
