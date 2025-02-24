import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Modal  } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';

const DeliveryOptions = ({
  deliveryMethod,
  pickupOption,
  pickupScheduledTime,
  deliveryOption,
  deliveryScheduledTime,
  address,
  currentTime,
  scheduleTimes,
  onDeliveryMethodChange,
  onPickupOptionChange,
  onPickupTimeChange,
  onDeliveryOptionChange,
  onDeliveryTimeChange,
  onAddressChange,
  formatDate,
}) => {
  // 假設的餐廳資訊
  const restaurantInfo = {
    name: 'Delicious Restaurant',
    address: '123 Main St, City, Country',
  };
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false); // 控制彈窗顯示
  const [selectedDate, setSelectedDate] = useState(null); // 選擇的日期
  const [selectedTime, setSelectedTime] = useState(null); // 選擇的時間

  // 打開彈窗
  const openScheduleModal = () => {
    setIsScheduleModalVisible(true);
  };

  // 關閉彈窗
  const closeScheduleModal = () => {
    setIsScheduleModalVisible(false);
  };

  // 處理日期選擇
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // 處理時間選擇
  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  // 確認選擇
  const confirmSchedule = () => {
    if (selectedDate && selectedTime) {
      const newTime = new Date(selectedDate);
      newTime.setHours(selectedTime.getHours());
      newTime.setMinutes(selectedTime.getMinutes());
      onPickupTimeChange(newTime.toISOString());
    }
    closeScheduleModal();
  };

  return (
    <View>
      <View style={styles.optionContainer}>
        <TouchableOpacity
          style={[styles.option, deliveryMethod === 'pickup' ? styles.selectedLeft : styles.deselectedLeft]}
          onPress={() => onDeliveryMethodChange('pickup')}
        >
          <Text style={[styles.optionText, deliveryMethod === 'pickup' && styles.selectedText]}>Pickup</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, deliveryMethod === 'delivery' ? styles.selectedRight : styles.deselectedRight]}
          onPress={() => onDeliveryMethodChange('delivery')}
        >
          <Text style={[styles.optionText, deliveryMethod === 'delivery' && styles.selectedText]}>Delivery</Text>
        </TouchableOpacity>
      </View>

      {deliveryMethod === 'pickup' && (
        <View>
          <View style={styles.restaurantInfoContainer}>
            <Icon name="store" size={32} color="#4CAF50" style={styles.storeIcon} />
            <View style={styles.restaurantDetails}>
              <Text style={styles.restaurantName}>{restaurantInfo.name}</Text>
              <Text style={styles.restaurantAddress}>{restaurantInfo.address}</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.pickupTimeContainer}>
            <Icon name="access-time" size={24} color="#4CAF50" style={styles.clockIcon} />
            <Text style={styles.pickupTimeText}>Pickup Time: 15-25min</Text>
          </View>

          <View style={styles.timeOptionContainer}>
            <TouchableOpacity
              style={[
                styles.timeOption,
                pickupOption === 'immediate' ? styles.selectedTime : styles.deselectedTime,
              ]}
              onPress={() => onPickupOptionChange('immediate')}
            >
              <Text style={styles.timeText}>Standard</Text>
              <Text style={styles.timeSubText}>15-25min</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={[
                styles.timeOption,
                pickupOption === 'scheduled' ? styles.selectedTime : styles.deselectedTime,
            ]}
            onPress={openScheduleModal} // 點擊打開彈窗
            >
            <Text style={styles.timeText}>Schedule</Text>
            </TouchableOpacity>
          </View>

          {pickupOption === 'scheduled' && (
            <View>
              <Text style={styles.sectionHeader}>Set Schedule</Text>
              <View style={styles.timePickerRow}>
                <Picker
                  selectedValue={pickupScheduledTime ? pickupScheduledTime.toISOString() : null}
                  style={styles.datePicker}
                  onValueChange={onPickupTimeChange}
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const date = new Date(currentTime);
                    date.setDate(date.getDate() + i);
                    return (
                      <Picker.Item key={i} label={formatDate(date)} value={date.toISOString()} />
                    );
                  })}
                </Picker>
                <Picker
                  selectedValue={pickupScheduledTime ? pickupScheduledTime.toISOString() : null}
                  style={styles.timePicker}
                  onValueChange={onPickupTimeChange}
                >
                  {scheduleTimes.map((time, index) => (
                    <Picker.Item key={index} label={time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} value={time.toISOString()} />
                  ))}
                </Picker>
              </View>
            </View>
          )}
        </View>
      )}
      

      {deliveryMethod === 'delivery' && (
        <View>
          <Text style={styles.sectionHeader}>Delivery Time</Text>
          <View style={styles.timeOptionContainer}>
            <TouchableOpacity
              style={[styles.timeOption, deliveryOption === 'immediate' ? styles.selectedTime : styles.deselectedTime]}
              onPress={() => onDeliveryOptionChange('immediate')}
            >
              <Text style={[styles.timeText, deliveryOption === 'immediate' && styles.selectedText]}>Immediate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timeOption, deliveryOption === 'scheduled' ? styles.selectedTime : styles.deselectedTime]}
              onPress={() => onDeliveryOptionChange('scheduled')}
            >
              <Text style={[styles.timeText, deliveryOption === 'scheduled' && styles.selectedText]}>Scheduled</Text>
            </TouchableOpacity>
          </View>

          

          <View>
            <Text style={styles.sectionHeader}>Delivery Address</Text>
            <View style={styles.addressBox}>
              <TouchableOpacity onPress={onAddressChange}>
                <View style={styles.addressBox}>
                  <Icon name="location-on" size={32} color="#4CAF50" style={styles.addressIcon} />
                  <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="tail">
                    {address || 'Address not available'}
                  </Text>
                  <Icon name="keyboard-arrow-down" size={32} color="black" style={styles.arrowIcon} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {deliveryOption === 'scheduled' && (
            <View>
              <Text style={styles.sectionHeader}>Select Delivery Time</Text>
              <Picker
                selectedValue={deliveryScheduledTime ? deliveryScheduledTime.toISOString() : null}
                style={styles.datePicker}
                onValueChange={onDeliveryTimeChange}
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const date = new Date(currentTime);
                  date.setDate(date.getDate() + i);
                  return (
                    <Picker.Item key={i} label={formatDate(date)} value={date.toISOString()} />
                  );
                })}
              </Picker>
              <Picker
                selectedValue={deliveryScheduledTime ? deliveryScheduledTime.toISOString() : null}
                style={styles.timePicker}
                onValueChange={onDeliveryTimeChange}
              >
                {scheduleTimes.map((time, index) => (
                  <Picker.Item key={index} label={time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} value={time.toISOString()} />
                ))}
              </Picker>
            </View>
          )}
        </View>
        
      )}
    <Modal
      visible={isScheduleModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeScheduleModal}
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

          {/* 確認按鈕 */}
          <TouchableOpacity style={styles.confirmButton} onPress={confirmSchedule}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>

          {/* 取消按鈕 */}
          <TouchableOpacity style={styles.cancelButton} onPress={closeScheduleModal}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

      
    </View>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  option: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedLeft: {
    backgroundColor: '#4CAF50',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  deselectedLeft: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  selectedRight: {
    backgroundColor: '#4CAF50',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  deselectedRight: {
    backgroundColor: '#fff',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  optionText: {
    fontSize: 16,
  },
  selectedText: {
    color: '#fff',
  },
  timeOptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeOption: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginHorizontal: 8,
  },
  selectedTime: {
    borderColor: '#000', // 選中時黑色邊框
  },
  deselectedTime: {
    borderColor: '#ccc', // 未選中時灰色邊框
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeSubText: {
    fontSize: 14,
    color: '#666', // 灰色字體
    marginTop: 4,
  },
  timePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePicker: {
    flex: 1,
  },
  timePicker: {
    flex: 1,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  addressIcon: {
    marginRight: 8,
  },
  addressText: {
    flex: 1,
    fontSize: 16,
  },
  arrowIcon: {
    marginLeft: 8,
  },
  restaurantInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'left',
    marginBottom: 16,
  },
  storeIcon: {
    marginRight: 15,
    fontSize: 30,
  },
  restaurantDetails: {
    alignItems: 'flex-start',
  },
  restaurantName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  restaurantAddress: {
    fontSize: 22,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 16,
  },
  pickupTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'left',
    marginBottom: 26,
  },
  clockIcon: {
    marginRight: 15,
    fontSize: 30,
  },
  pickupTimeText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
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

export default DeliveryOptions;