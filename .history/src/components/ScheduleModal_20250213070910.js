import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // 確保安裝 @expo/vector-icons

const ScheduleModal = ({ isVisible, onClose, onConfirm, currentTime, formatDate }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // 生成 30 天的日期
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date(currentTime || new Date());
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // 生成 11:00 AM ~ 10:00 PM，每 30 分鐘
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 11; hour <= 22; hour++) {
      for (let minute of ['00', '30']) {
        const suffix = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour;
        times.push({ time: `${displayHour}:${minute} ${suffix}`, hour, minute });
      }
    }
    return times;
  };

  const dateOptions = generateDateOptions();
  const timeOptions = generateTimeOptions();

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      const selectedDateTime = new Date(selectedDate);
      selectedDateTime.setHours(selectedTime.hour, selectedTime.minute);
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

          {/* 標題 */}
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
            {timeOptions.map((timeObj, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.timeOption, selectedTime?.time === timeObj.time && styles.selectedTimeOption]}
                onPress={() => setSelectedTime(timeObj)}
              >
                <Text style={styles.timeText}>{timeObj.time}</Text>
                <View
                  style={[
                    styles.radio,
                    selectedTime?.time === timeObj.time && styles.selectedRadio,
                    timeObj.minute === '00' && styles.fullHourRadio, // 整點黑色
                  ]}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* 確認按鈕 */}
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
    maxHeight: '90%', // 讓彈窗更長
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
  },
  selectedDateOption: {
    borderColor: 'black',
  },
  dateText: {
    fontSize: 14,
    color: '#777',
  },
  timePicker: {
    maxHeight: 350, // 調整頁面長度
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
  fullHourRadio: {
    backgroundColor: 'black', // 整點黑色
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
