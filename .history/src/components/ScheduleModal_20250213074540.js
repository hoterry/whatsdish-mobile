import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // 確保安裝 @expo/vector-icons

const ScheduleModal = ({ isVisible, onClose, onConfirm, currentTime, formatDate }) => {
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
        times.push(`${hour}:${minute}`);
      }
    }
    return times;
  };

  const dateOptions = generateDateOptions();
  const timeOptions = generateTimeOptions();

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      const selectedDateTime = new Date(selectedDate);
      const [hour, minute] = selectedTime.split(':');
      selectedDateTime.setHours(hour, minute);
      onConfirm(selectedDateTime.toISOString());
      onClose();
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* 返回按鈕 */}
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          {/* 標題置中 */}
          <Text style={styles.title}>Set Schedule</Text>

          {/* 日期選擇 */}
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
                <Text style={styles.dateText}>{formatDate ? formatDate(date) : date.toDateString()}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* 時間選擇 */}
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

          {/* 設定按鈕 */}
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
    paddingTop: 50, // 增加上方間距，適應返回按鈕
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center', // 讓標題置中
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
    height: 50
  },
  selectedDateOption: {
    borderColor: 'black',
  },
  dateText: {
    fontSize: 14,
    color: '#777',
  },
  timePicker: {
    maxHeight: 300, // 調整頁面長度
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
