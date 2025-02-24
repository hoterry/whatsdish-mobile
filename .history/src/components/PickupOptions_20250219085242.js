import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import ScheduleModal from './ScheduleModal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LanguageContext } from '../context/LanguageContext'; // 引入 LanguageContext

const translations = {
  EN: {
    pickupTime: "Pickup Time:",
    standard: "Standard",
    schedule: "Schedule",
    selectTime: "Select a time",
  },
  ZH: {
    pickupTime: "取餐時間:",
    standard: "立即",
    schedule: "預約",
    selectTime: "選擇時間",
  },
};
const PickupOptions = ({
  restaurantId,  // Receive restaurantId as prop
  restaurants,
  pickupOption,
  pickupScheduledTime,
  currentTime,
  scheduleTimes,
  onPickupOptionChange,
  onPickupTimeChange,
  formatDate,
}) => {
  const { language } = useContext(LanguageContext); // 取得當前語言
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  // Find the restaurant details based on the restaurantId
  const restaurant = Array.isArray(restaurants) ? restaurants.find(r => r.gid === restaurantId) : null;

  const restaurantName = restaurant ? restaurant.name : "Restaurant not found";
  const restaurantAddress = restaurant ? restaurant.address : "Address not available";

  useEffect(() => {
    console.log("Received restaurantId:", restaurantId); // Log restaurantId
    console.log("Received restaurants:", restaurants); // Log the entire restaurants array
    if (pickupScheduledTime) {
      setSelectedTime(pickupScheduledTime);
    }
  }, [pickupScheduledTime]);

  const openScheduleModal = () => {
    setIsScheduleModalVisible(true);
  };

  const closeScheduleModal = () => {
    setIsScheduleModalVisible(false);
  };

  const handlePickupTimeConfirm = (time) => {
    setSelectedTime(time);
    onPickupTimeChange(time);
    closeScheduleModal();
  };

  const formatSelectedTime = (time) => {
    if (!time) return translations[language].selectTime;
    const date = new Date(time);
    return date.toLocaleString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View>
      <View style={styles.restaurantInfoContainer}>
        <Icon name="store" size={32} color="#000" style={styles.storeIcon} />
        <View style={styles.restaurantDetails}>
          <Text style={styles.restaurantName}>{restaurantName}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Text style={styles.restaurantAddress}>
              {restaurantAddress}
            </Text>
          </ScrollView>
        </View>
      </View>
      <View style={styles.divider} />

      <View style={styles.pickupTimeContainer}>
        <Icon name="access-time" size={24} color="#000" style={styles.clockIcon} />
        <View style={styles.pickupTimeTextContainer}>
          <Text style={styles.pickupTimeText}>{translations[language].pickupTime}</Text>
          <Text style={styles.pickupTime}>
            {pickupOption === 'immediate'
              ? '15-25min'
              : formatSelectedTime(selectedTime || pickupScheduledTime)}
          </Text>
        </View>
      </View>

      <View style={styles.timeOptionContainer}>
        <TouchableOpacity
          style={[styles.timeOption, pickupOption === 'immediate' ? styles.selectedTime : styles.deselectedTime]}
          onPress={() => onPickupOptionChange('immediate')}
        >
          <Text style={styles.timeText}>{translations[language].standard}</Text>
          <Text style={styles.timeSubText}>15-25min</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeOption, pickupOption === 'scheduled' ? styles.selectedTime : styles.deselectedTime]}
          onPress={() => {
            onPickupOptionChange('scheduled');
            openScheduleModal();
          }}
        >
          <Text style={styles.timeText}>{translations[language].schedule}</Text>
          <Text style={styles.timeSubText}>
            {pickupOption === 'scheduled'
              ? formatSelectedTime(selectedTime || pickupScheduledTime)
              : translations[language].selectTime}
          </Text>
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
    </View>
  );
};


const styles = StyleSheet.create({
  timeOptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeOption: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginHorizontal: 8,
  },
  selectedTime: {
    borderColor: '#000', // Selected time with black border
  },
  deselectedTime: {
    borderColor: '#ccc', // Unselected time with gray border
  },
  timeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  timeSubText: {
    fontSize: 16,
    color: '#666', // Gray font
    marginTop: 4,
  },
  restaurantInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 16,
    maxWidth: 350,
  },
  storeIcon: {
    marginRight: 15,
    fontSize: 30,
  },
  restaurantDetails: {
    alignItems: 'flex-start',
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  restaurantAddress: {
    fontSize: 20,
    color: '#666',
    flexWrap: 'wrap',
    maxWidth: 250
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 5,
    marginBottom: 15,
  },
  pickupTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'left',
    marginBottom: 20,
  },
  pickupTimeTextContainer: {
    flexDirection: 'column',
  },
  clockIcon: {
    marginRight: 15,
    fontSize: 30,
  },
  pickupTimeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pickupTime: {
    fontSize: 20,
    color: '#666',
  },
});

export default PickupOptions;
