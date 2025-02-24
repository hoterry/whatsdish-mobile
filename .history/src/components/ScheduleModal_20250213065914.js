import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ScheduleModal = ({ isVisible, onClose, onConfirm, currentTime }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const generateDateOptions = () => {
    const dates = [];
    const today = new Date(currentTime || new Date());
    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date,
      });
    }
    return dates;
  };

  const generateTimeOptions = () => {
    const times = [];
    let startHour = 11;
    let startMinute = 0;
    while (startHour < 22 || (startHour === 22 && startMinute === 0)) {
      times.push(`${startHour % 12 || 12}:${startMinute === 0 ? '00' : '30'}${startHour >= 12 ? 'pm' : 'am'}`);
      startMinute += 30;
      if (startMinute === 60) {
        startMinute = 0;
        startHour++;
      }
    }
    return times;
  };

  const dateOptions = generateDateOptions();
  const timeOptions = generateTimeOptions();

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onConfirm(`${selectedDate.date.toISOString()} ${selectedTime}`);
      onClose();
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Set Schedule</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datePicker}>
            {dateOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dateOption, selectedDate?.date.toDateString() === item.date.toDateString() && styles.selectedDateOption]}
                onPress={() => setSelectedDate(item)}
              >
                <Text style={styles.dateLabel}>{item.label}</Text>
                <Text style={styles.dateText}>{item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView style={styles.timePicker}>
            {timeOptions.map((time, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.timeOption, selectedTime === time && styles.selectedTimeOption]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={styles.timeText}>{time}</Text>
                <View style={[styles.radio, selectedTime === time && styles.selectedRadio]} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
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
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  datePicker: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dateOption: {
    padding: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 10,
    width: 100,
  },
  selectedDateOption: {
    borderColor: 'black',
  },
  dateLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  dateText: {
    fontSize: 14,
    color: '#777',
  },
  timePicker: {
    maxHeight: 400,
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
    fontSize: 16,
    fontWeight: 'bold',
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
    backgroundColor: 'white',
  },
  confirmButton: {
    backgroundColor: 'black',
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
