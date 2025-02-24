import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import ScheduleModal from './ScheduleModal';

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
  const [selectedTime, setSelectedTime] = useState(null);

  // 打開彈窗
  const openScheduleModal = () => {
    setIsScheduleModalVisible(true);
  };

  // 關閉彈窗
  const closeScheduleModal = () => {
    setIsScheduleModalVisible(false);
  };

  // 處理選擇的時間
  const handlePickupTimeConfirm = (time) => {
    setSelectedTime(time); // 存儲選擇的時間
    onPickupTimeChange(time); // 將時間傳遞給父組件
  };

  // 格式化顯示時間和日期
  const formatSelectedTime = (time) => {
    if (!time) return '15-25min';
    const date = new Date(time);
    return date.toLocaleString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 重置時間顯示為 15-25min 當切換回 Pickup
  const handleDeliveryMethodChange = (method) => {
    if (method === 'pickup') {
      setSelectedTime(null); // 重置時間
    }
    onDeliveryMethodChange(method);
  };

  return (
    <View>
      <View style={styles.optionContainer}>
        <TouchableOpacity
          style={[styles.option, deliveryMethod === 'pickup' ? styles.selectedLeft : styles.deselectedLeft]}
          onPress={() => handleDeliveryMethodChange('pickup')}
        >
          <Text style={[styles.optionText, deliveryMethod === 'pickup' && styles.selectedText]}>Pickup</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, deliveryMethod === 'delivery' ? styles.selectedRight : styles.deselectedRight]}
          onPress={() => handleDeliveryMethodChange('delivery')}
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
            <Text style={styles.pickupTimeText}>Pickup Time:</Text>
            <Text style={styles.pickupTimeValue}>
              {formatSelectedTime(selectedTime || pickupScheduledTime)}
            </Text>
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
              {selectedTime && (
                <Text style={styles.selectedTimeText}>
                  {formatSelectedTime(selectedTime)}
                </Text>
              )}
            </TouchableOpacity>
            <ScheduleModal
              isVisible={isScheduleModalVisible}
              onClose={closeScheduleModal}
              onConfirm={handlePickupTimeConfirm}
              currentTime={currentTime}
              scheduleTimes={scheduleTimes}
              formatDate={formatDate}
            />
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
                    <Picker.Item
                      key={index}
                      label={time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      value={time.toISOString()}
                    />
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
              style={[
                styles.timeOption,
                pickupOption === 'scheduled' ? styles.selectedTime : styles.deselectedTime,
              ]}
              onPress={openScheduleModal} // 點擊打開彈窗
            >
              <Text style={styles.timeText}>Schedule</Text>
            </TouchableOpacity>
            <ScheduleModal
              isVisible={isScheduleModalVisible}
              onClose={closeScheduleModal}
              onConfirm={onPickupTimeChange}
              currentTime={currentTime}
              scheduleTimes={scheduleTimes}
              formatDate={formatDate}
            />
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
                  <Picker.Item
                    key={index}
                    label={time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    value={time.toISOString()}
                  />
                ))}
              </Picker>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  option: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedLeft: {
    backgroundColor: '#4CAF50',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  deselectedLeft: {
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  selectedRight: {
    backgroundColor: '#4CAF50',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  deselectedRight: {
    backgroundColor: '#f0f0f0',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  selectedText: {
    color: '#fff',
  },
  restaurantInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  storeIcon: {
    marginRight: 10,
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 20,
  },
  pickupTimeContainer: {
    marginBottom: 20,
  },
  clockIcon: {
    marginBottom: 10,
  },
  pickupTimeText: {
    fontSize: 16,
    color: '#666',
  },
  pickupTimeValue: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  timeOptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeOption: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  selectedTime: {
    backgroundColor: '#4CAF50',
  },
  deselectedTime: {
    backgroundColor: '#f0f0f0',
  },
  timeText: {
    fontSize: 16,
    color: '#000',
  },
  timeSubText: {
    fontSize: 14,
    color: '#666',
  },
  selectedTimeText: {
    fontSize: 14,
    color: '#666',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePicker: {
    flex: 1,
    marginRight: 10,
  },
  timePicker: {
    flex: 1,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  addressIcon: {
    marginRight: 10,
  },
  addressText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  arrowIcon: {
    marginLeft: 10,
  },
});

export default DeliveryOptions;