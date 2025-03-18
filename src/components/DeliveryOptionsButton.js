import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PickupOptions from './PickupOptions';
import DeliveryOptions from './DeliveryOptions';
import { LanguageContext } from '../context/LanguageContext'; 

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
  const { language } = useContext(LanguageContext); 

  return (
    <View style={styles.container}>      
      <View style={styles.optionContainer}>
        <TouchableOpacity
          style={[
            styles.option, 
            deliveryMethod === 'pickup' ? styles.selectedOption : styles.deselectedOption,
            styles.leftOption
          ]}
          onPress={() => onDeliveryMethodChange('pickup')}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="storefront" 
            size={18} 
            color={deliveryMethod === 'pickup' ? '#FFFFFF' : '#777777'} 
            style={styles.optionIcon}
          />
          <Text style={[
            styles.optionText, 
            deliveryMethod === 'pickup' ? styles.selectedText : styles.deselectedText
          ]}>
            {translations[language].pickup} 
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.option, 
            deliveryMethod === 'delivery' ? styles.selectedOption : styles.deselectedOption,
            styles.rightOption
          ]}
          onPress={() => onDeliveryMethodChange('delivery')}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="bicycle" 
            size={18} 
            color={deliveryMethod === 'delivery' ? '#FFFFFF' : '#777777'} 
            style={styles.optionIcon}
          />
          <Text style={[
            styles.optionText, 
            deliveryMethod === 'delivery' ? styles.selectedText : styles.deselectedText
          ]}>
            {translations[language].delivery}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
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
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333333',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    height: 48,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
  },
  leftOption: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderRightWidth: 0.5,
  },
  rightOption: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderLeftWidth: 0.5,
  },
  selectedOption: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  deselectedOption: {
    backgroundColor: '#F7F7F7',
    borderColor: '#DDDDDD',
  },
  optionIcon: {
    marginRight: 6,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  deselectedText: {
    color: '#777777',
  },
  contentContainer: {
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  }
});

export default DeliveryOptionsButton;