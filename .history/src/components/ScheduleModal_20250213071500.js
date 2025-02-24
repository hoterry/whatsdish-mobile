import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // 確保安裝 @expo/vector-icons

const ScheduleModal = ({ isVisible, onClose, onConfirm, currentTime, formatDate }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // 生成 7 天的日期
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
                <Text style={styles.weekText}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</Text>
                <Text style={styles.dateText}>{date.getDate()}</Text>
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
                <Text style={[styles.timeText, selectedTime?.time === timeObj.time && styles.selectedTimeText]}>
                  {timeObj.time}
                </Text>
                <View
                  style={[
                    styles.radio,
                    { backgroundColor: selectedTime?.time === timeObj.time ? 'black' : '#BFBFBF' }, // 選取時黑色，未選取時灰色
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
    padding: 16,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 10,
    width: 100,
    height: 80, // 增加高度
    justifyContent: 'center',
  },
  selectedDateOption: {
    borderColor: 'black',
  },
  weekText: {
    fontSize: 16,
    fontWeight: 'bold', // 星期加粗
  },
  dateText: {
    fontSize: 18, // 日期數字加大
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
  },
  selectedTimeText: {
    fontWeight: 'bold', // 只有被選中的時間才加粗
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
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
