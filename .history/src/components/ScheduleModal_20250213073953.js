import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // 確保安裝 @expo/vector-icons

const ScheduleModal = ({ isVisible, onClose, onConfirm, currentTime }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

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

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 11; hour <= 22; hour++) {
      for (let minute of ['00', '30']) {
        const period = hour >= 12 ? 'pm' : 'am';
        const displayHour = hour > 12 ? hour - 12 : hour;
        times.push(`${displayHour}:${minute} ${period}`);
      }
    }
    return times;
  };

  const dateOptions = generateDateOptions();
  const timeOptions = generateTimeOptions();

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      const selectedDateTime = new Date(selectedDate);
      let [time, period] = selectedTime.split(' ');
      let [hour, minute] = time.split(':');
      hour = parseInt(hour, 10);
      if (period === 'pm' && hour !== 12) hour += 12;
      if (period === 'am' && hour === 12) hour = 0;
      selectedDateTime.setHours(hour, minute);
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

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datePicker}>
            {dateOptions.map((date, index) => (
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
            {timeOptions.map((time, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.timeOption, selectedTime === time && styles.selectedTimeOption]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[styles.timeText, selectedTime === time && styles.selectedTimeText]}>{time}</Text>
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
    paddingTop: 50,
    height: '80%',
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
  datePicker: {
    flexDirection: 'row',
    marginBottom: 18,

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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#777',
  },
  timePicker: {
    maxHeight: 100, // 調整頁面長度
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
  timeText: {
    fontSize: 20, // 加大字體
    fontWeight: 'bold', // 與日期一致
    color: '#333', // 統一顏色
  },
  selectedTimeText: {
    fontWeight: 'bold',
    color: 'black',
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
