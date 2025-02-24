import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';

const ScheduleModal = ({
  isVisible,
  onClose,
  onConfirm,
  currentTime,
  scheduleTimes,
  formatDate,
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // 生成日期選項（從今天起每 7 天，共 7 個選項）
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date(currentTime || new Date());
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i * 7);
      dates.push(date);
    }
    return dates;
  };

  // 生成時間選項（11:00 AM 到 10:00 PM，每半小時）
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 11; hour <= 22; hour++) {
      for (let minute of ['00', '30']) {
        const time = `${hour}:${minute}`;
        times.push(time);
      }
    }
    return times;
  };

  // 日期選項
  const dateOptions = generateDateOptions();

  // 時間選項
  const timeOptions = generateTimeOptions();

  // 處理日期選擇
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // 處理時間選擇
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // 處理確認按鈕
  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      const selectedDateTime = new Date(selectedDate);
      const [hour, minute] = selectedTime.split(':');
      selectedDateTime.setHours(hour, minute);
      onConfirm(selectedDateTime.toISOString());
      onClose();
    } else {
      alert('Please select a date and time.');
    }
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* 日期選擇器 */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datePicker}>
            {dateOptions.map((date, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateOption,
                  selectedDate?.toDateString() === date.toDateString() && styles.selectedDateOption,
                ]}
                onPress={() => handleDateSelect(date)}
              >
                <Text style={styles.dateText}>{formatDate ? formatDate(date) : date.toDateString()}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* 時間選擇器 */}
          <ScrollView style={styles.timePicker}>
            {timeOptions.map((time, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.timeOption, selectedTime === time && styles.selectedTimeOption]}
                onPress={() => handleTimeSelect(time)}
              >
                <Text style={styles.timeText}>{time}</Text>
                <View style={styles.circle} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* 確認按鈕 */}
          <Button title="Confirm" onPress={handleConfirm} />
          {/* 關閉按鈕 */}
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

// 樣式
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
    borderRadius: 10,
    padding: 16,
  },
  datePicker: {
    marginBottom: 16,
  },
  dateOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginRight: 10,
  },
  selectedDateOption: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  dateText: {
    fontSize: 14,
  },
  timePicker: {
    maxHeight: 200,
    marginBottom: 16,
  },
  timeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedTimeOption: {
    backgroundColor: '#e6f7ff',
  },
  timeText: {
    fontSize: 16,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007bff',
  },
});

export default ScheduleModal;