import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Platform
} from 'react-native';
import ScheduleModal from './ScheduleModal';
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from '../context/LanguageContext';

const translations = {
  EN: {
    pickupTime: "Pickup Time",
    standard: "Standard",
    schedule: "Schedule",
    selectTime: "Select a time",
    estimatedTime: "Estimated pickup time"
  },
  ZH: {
    pickupTime: "取餐時間",
    standard: "立即",
    schedule: "預約",
    selectTime: "選擇時間",
    estimatedTime: "預計取餐時間"
  },
};

const PickupOptions = ({
  restaurantId, 
  restaurants,
  pickupOption,
  pickupScheduledTime,
  currentTime,
  scheduleTimes,
  onPickupOptionChange,
  onPickupTimeChange,
  formatDate,
}) => {
  const { language } = useContext(LanguageContext);
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  const restaurant = Array.isArray(restaurants?.data) 
    ? restaurants.data.find(r => r.gid === restaurantId) 
    : null;
  
  const restaurantName = restaurant ? restaurant.name : "Restaurant not found";
  const restaurantAddress = restaurant ? restaurant.formatted_address : "Address not available";
  
  useEffect(() => {
    if (__DEV__) {
      console.log("[Pick-up Option Log] Received restaurantId :", restaurantId);
      console.log("[Pick-up Option Log] Received restaurants :", restaurants);
    }
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
    if (isNaN(date.getTime())) {
      return translations[language].selectTime; 
    }

    return date.toLocaleString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>

      <View style={styles.restaurantInfoContainer}>
        <Ionicons name="storefront" size={32} color="#000" style={styles.storeIcon} />
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


      <View style={styles.pickupTimeSection}>
        <Text style={styles.sectionTitle}>{translations[language].pickupTime}</Text>
        
        <View style={styles.timeOptionContainer}>
          <TouchableOpacity
            style={[
              styles.timeOption, 
              pickupOption === 'immediate' ? styles.selectedTime : styles.deselectedTime,
              { marginRight: 8 }
            ]}
            onPress={() => onPickupOptionChange('immediate')}
            activeOpacity={0.7}
          >
            <View style={styles.timeOptionContent}>
              <View style={styles.timeIconContainer}>
                <Ionicons 
                  name="flash" 
                  size={16} 
                  color={pickupOption === 'immediate' ? "#000" : "#777777"} 
                />
              </View>
              <View style={styles.timeTextContainer}>
                <Text style={[
                  styles.timeText,
                  pickupOption === 'immediate' ? styles.selectedTimeText : styles.deselectedTimeText
                ]}>
                  {translations[language].standard}
                </Text>
                <Text style={styles.timeSubText}>15-25min</Text>
              </View>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.timeOption, 
              pickupOption === 'scheduled' ? styles.selectedTime : styles.deselectedTime,
              { marginLeft: 8 }
            ]}
            onPress={() => {
              onPickupOptionChange('scheduled');
              openScheduleModal();
            }}
            activeOpacity={0.7}
          >
            <View style={styles.timeOptionContent}>
              <View style={styles.timeIconContainer}>
                <Ionicons 
                  name="calendar" 
                  size={16} 
                  color={pickupOption === 'scheduled' ? "#000" : "#777777"} 
                />
              </View>
              <View style={styles.timeTextContainer}>
                <Text style={[
                  styles.timeText,
                  pickupOption === 'scheduled' ? styles.selectedTimeText : styles.deselectedTimeText
                ]}>
                  {translations[language].schedule}
                </Text>
                <Text style={styles.timeSubText} numberOfLines={1}>
                  {pickupOption === 'scheduled'
                    ? formatSelectedTime(selectedTime || pickupScheduledTime)
                    : translations[language].selectTime}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.estimatedTimeContainer}>
          <Ionicons name="time-outline" size={20} color="#666666" style={styles.estimatedTimeIcon} />
          <View>
            <Text style={styles.estimatedTimeLabel}>{translations[language].estimatedTime}</Text>
            <Text style={styles.estimatedTimeValue}>
              {pickupOption === 'immediate' ? '15 - 25min' : formatSelectedTime(selectedTime || pickupScheduledTime)}
            </Text>
          </View>
        </View>
      </View>

      <ScheduleModal
        isVisible={isScheduleModalVisible}
        onClose={closeScheduleModal}
        onConfirm={handlePickupTimeConfirm}
        currentTime={currentTime}
        scheduleTimes={scheduleTimes}
        formatDate={formatDate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  restaurantAddress: {
    fontSize: 18,
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
  
  // 新設計風格的時間選擇相關樣式
  pickupTimeSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333333',
  },
  timeOptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeOption: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  selectedTime: {
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
  },
  deselectedTime: {
    borderColor: '#EEEEEE',
    backgroundColor: '#FAFAFA',
  },
  timeOptionContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIconContainer: {
    marginRight: 12,
  },
  timeTextContainer: {
    flex: 1,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  selectedTimeText: {
    color: '#000000',
  },
  deselectedTimeText: {
    color: '#777777',
  },
  timeSubText: {
    fontSize: 14,
    color: '#666666',
  },
  estimatedTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 10,
  },
  estimatedTimeIcon: {
    marginRight: 12,
  },
  estimatedTimeLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  estimatedTimeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
});

export default PickupOptions;