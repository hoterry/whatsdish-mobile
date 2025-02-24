import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Icon } from 'react-native';
import ScheduleModal from './ScheduleModal';

const PickupOptions = ({
  pickupOption,
  pickupScheduledTime,
  currentTime,
  scheduleTimes,
  onPickupOptionChange,
  onPickupTimeChange,
  formatDate,
}) => {
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
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
    if (!time) return 'Select a time';
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
        <Icon name="store" size={32} color="#4CAF50" style={styles.storeIcon} />
        <View style={styles.restaurantDetails}>
          <Text style={styles.restaurantName}>Peaches Cafe Richmond</Text>
          <Text style={styles.restaurantAddress}>8580 Alexandra Rd Unit 1020, Richmond, BC V6X 1C3</Text>
        </View>
      </View>
      <View style={styles.divider} />

      <View style={styles.pickupTimeContainer}>
        <Icon name="access-time" size={24} color="#4CAF50" style={styles.clockIcon} />
        <View style={styles.pickupTimeTextContainer}>
          <Text style={styles.pickupTimeText}>Pickup Time:</Text>
          <Text style={styles.pickupTime}>
            {pickupOption === 'immediate' ? '15-25min' : formatSelectedTime(selectedTime || pickupScheduledTime)}
          </Text>
        </View>
      </View>

      <View style={styles.timeOptionContainer}>
        <TouchableOpacity
          style={[styles.timeOption, pickupOption === 'immediate' ? styles.selectedTime : styles.deselectedTime]}
          onPress={() => onPickupOptionChange('immediate')}
        >
          <Text style={styles.timeText}>Standard</Text>
          <Text style={styles.timeSubText}>15-25min</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeOption, pickupOption === 'scheduled' ? styles.selectedTime : styles.deselectedTime]}
          onPress={() => {
            onPickupOptionChange('scheduled');
            openScheduleModal();
          }}
        >
          <Text style={styles.timeText}>Schedule</Text>
          <Text style={styles.timeSubText}>
            {pickupOption === 'scheduled' ? formatSelectedTime(selectedTime || pickupScheduledTime) : 'Select a time'}
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

export default PickupOptions;
