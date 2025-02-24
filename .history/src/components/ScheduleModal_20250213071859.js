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
        const timeString = `${hour}:${minute}`;
        const time = new Date(`1970-01-01T${timeString}:00`);
        times.push(time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
      }
    }
    return times;
  };

  const dateOptions = generateDateOptions();
  const timeOptions = generateTimeOptions();

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      const selectedDateTime = new Date(selectedDate);
      const [time, modifier] = selectedTime.split(' ');
      let [hour, minute] = time.split(':');
      if (modifier === 'PM' && hour < 12) hour = parseInt(hour) + 12;
      if (modifier === 'AM' && hour === '12') hour = '00';
      selectedDateTime.setHours(hour, minute);
      onConfirm(selectedDateTime.toISOString());
      onClose();
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* 關閉按鈕 */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="black" />
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
                <Text style={[styles.timeText, selectedTime === time && styles.selectedTimeText]}>{time}</Text>
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
    paddingTop: 20, // 調整上方間距
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
  dateText: {
    fontSize: 14,
    color: '#777',
  },
  timePicker: {
    maxHeight: 300,
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
    fontWeight: 'normal', // 預設不加粗
  },
  selectedTimeText: {
    fontWeight: 'bold', // 被選中的時間加粗
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
    backgroundColor: 'black', // 被選中的圓點全黑
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