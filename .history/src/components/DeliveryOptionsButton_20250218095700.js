import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PickupOptions from './PickupOptions';
import DeliveryOptions from './DeliveryOptions';
import { LanguageContext } from '../context/LanguageContext'; // 引入 LanguageContext

const translations = {
  EN: {
    pickup: "Pickup",
    delivery: "Delivery",
  },
  ZH: {
    pickup: "自取",
    delivery: "配送",
  },
};

const DeliveryOptionsButton = ({
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
  restaurantId,     
  restaurants, 
}) => {
  const { language } = useContext(LanguageContext); // 取得當前語言

  return (
    <View>
      <View style={styles.optionContainer}>
        <TouchableOpacity
          style={[styles.option, deliveryMethod === 'pickup' ? styles.selectedLeft : styles.deselectedLeft]}
          onPress={() => onDeliveryMethodChange('pickup')}
        >
          <Text style={[styles.optionText, deliveryMethod === 'pickup' && styles.selectedText]}>
            {translations[language].pickup} {/* 根據語言顯示 */}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, deliveryMethod === 'delivery' ? styles.selectedRight : styles.deselectedRight]}
          onPress={() => onDeliveryMethodChange('delivery')}
        >
          <Text style={[styles.optionText, deliveryMethod === 'delivery' && styles.selectedText]}>
            {translations[language].delivery} {/* 根據語言顯示 */}
          </Text>
        </TouchableOpacity>
      </View>

      {deliveryMethod === 'pickup' && (
        <PickupOptions
        restaurantId={restaurantId}  
        restaurants={restaurants} 
          pickupOption={pickupOption}
          pickupScheduledTime={pickupScheduledTime}
          currentTime={currentTime}
          scheduleTimes={scheduleTimes}
          onPickupOptionChange={onPickupOptionChange}
          onPickupTimeChange={onPickupTimeChange}
          formatDate={formatDate}
        />
      )}

      {deliveryMethod === 'delivery' && (
        <DeliveryOptions
          deliveryOption={deliveryOption}
          deliveryScheduledTime={deliveryScheduledTime}
          currentTime={currentTime}
          scheduleTimes={scheduleTimes}
          onDeliveryOptionChange={onDeliveryOptionChange}
          onDeliveryTimeChange={onDeliveryTimeChange}
          formatDate={formatDate}
          address={address}
          onAddressChange={onAddressChange}
        />
      )}
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
    backgroundColor: '#000',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  deselectedLeft: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  selectedRight: {
    backgroundColor: '#000',
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
});

export default DeliveryOptionsButton;
