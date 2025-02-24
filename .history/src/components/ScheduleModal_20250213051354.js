import React, { useState } from 'react';
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
  const [selectedDate, setSelectedDate] = useState(null); // 選擇的日期
  const [selectedTime, setSelectedTime] = useState(null); // 選擇的時間

  // 處理日期選擇
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // 處理時間選擇
  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  // 確認選擇
  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
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

          {/* 日期選擇器 */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Select Date</Text>
            <Picker
              selectedValue={selectedDate ? selectedDate.toISOString() : null}
              onValueChange={(itemValue) => handleDateChange(new Date(itemValue))}
            >
              {Array.from({ length: 5 }, (_, i) => {
                const date = new Date(currentTime);
                date.setDate(date.getDate() + i);
                return (
                  <Picker.Item key={i} label={formatDate(date)} value={date.toISOString()} />
                );
              })}
            </Picker>
          </View>

          {/* 時間選擇器 */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Select Time</Text>
            <Picker
              selectedValue={selectedTime ? selectedTime.toISOString() : null}
              onValueChange={(itemValue) => handleTimeChange(new Date(itemValue))}
            >
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明背景
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