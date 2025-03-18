import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Platform, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import PaymentMethod from './PaymentMethod';
import PaymentDisclaimer from './PaymentDisclaimer';
import { LanguageContext } from '../context/LanguageContext'; 
import Constants from 'expo-constants';
import LottieView from 'lottie-react-native';

// 信用卡品牌圖標映射
const cardImages = {
  VISA: require('../../assets/visa.png'),
  MASTERCARD: require('../../assets/mastercard.png'),
  AMEX: require('../../assets/amex.jpg'),

};

const Payment = () => {
  const { language } = useContext(LanguageContext);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedCards, setSavedCards] = useState([]); 
  const { API_URL } = Constants.expoConfig.extra; 

  const translations = {
    EN: {
      payment: "Payment Method",
      selectPayment: "Select Payment Method",
      addPayment: "Add Payment",
      securePayment: "All transactions are secure and encrypted"
    },
    ZH: {
      payment: "付款方式",
      selectPayment: "選擇付款方式",
      addPayment: "新增付款方式",
      securePayment: "所有交易均安全加密"
    }
  };

  const t = translations[language];

  const fetchSavedCards = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        console.error('No token found in SecureStore');
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_URL}/api/profile/payment-methods`,  {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data?.cards?.length > 0) {
        setSavedCards(data.cards);
        const defaultCard = data.cards.find(card => card.data.is_default) || data.cards[0];
        setSelectedMethod({
          type: defaultCard.data.bin.brand,
          last4: defaultCard.data.masked_pan.slice(-4),
          expiryDate: defaultCard.data.expiry_date || "",
        });
      } else {
        setSavedCards([]);
        setSelectedMethod(null);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedCards();
  }, []);

  const handleSelectMethod = (method) => {
    setSelectedMethod({
      type: method.data.bin.brand,
      last4: method.data.masked_pan.slice(-4),
      expiryDate: method.data.expiry_date || "",
    });
    setModalVisible(false);
  };

  const handleRemoveCard = async () => {
    await fetchSavedCards(); 
  };

  // 獲取卡品牌圖片
  const getCardImage = (type) => {
    if (type?.includes('VISA')) return cardImages.VISA;
    if (type?.includes('MASTER')) return cardImages.MASTERCARD;
    if (type?.includes('AMERICAN EXPRESS') || type?.includes('AMEX')) 
      return cardImages.AMEX;
    return cardImages.DEFAULT;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t.payment}</Text>
          <Ionicons name="shield-checkmark" size={16} color="#4CAF50" style={styles.secureIcon} />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          {Platform.OS === 'ios' ? (
            <LottieView
              source={require('../../assets/loading-animation.json')}
              autoPlay
              loop
              style={styles.loadingAnimation}
            />
          ) : (
            <ActivityIndicator size="large" color="#000000" />
          )}
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.paymentSelector} 
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          {selectedMethod ? (
            <View style={styles.selectedMethodContainer}>
              <Image 
                source={getCardImage(selectedMethod.type)}
                style={styles.cardImage}
                resizeMode="contain"
              />
              <View style={styles.cardDetails}>
                <Text style={styles.cardType}>
                  {selectedMethod.type?.split(' ')[0] || 'Card'}
                </Text>
                <Text style={styles.cardNumber}>
                  •••• •••• •••• {selectedMethod.last4}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
            </View>
          ) : (
            <View style={styles.addPaymentContainer}>
              <Ionicons name="add-circle-outline" size={24} color="#000000" />
              <Text style={styles.addPaymentText}>{t.addPayment}</Text>
              <View style={styles.spacer} />
              <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
            </View>
          )}
        </TouchableOpacity>
      )}

      <View style={styles.secureInfoContainer}>
        <Ionicons name="lock-closed" size={12} color="#757575" />
        <Text style={styles.secureInfoText}>{t.securePayment}</Text>
      </View>

      <Modal 
        visible={modalVisible} 
        transparent 
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <PaymentMethod
              onSelectMethod={handleSelectMethod}
              onClose={() => setModalVisible(false)}
              onRemoveCard={handleRemoveCard} 
            />
          </View>
        </View>
      </Modal>

      <PaymentDisclaimer />
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
  header: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#333333',
    marginRight: 6,
  },
  secureIcon: {
    marginTop: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    marginVertical: 8,
  },
  loadingAnimation: {
    width: 80,
    height: 80,
  },
  paymentSelector: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    padding: 16,
    marginBottom: 12,
  },
  selectedMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImage: {
    width: 40,
    height: 25,
    marginRight: 12,
  },
  cardDetails: {
    flex: 1,
  },
  cardType: {
    fontSize: 15,
    fontWeight: '500',
    color: '#424242',
    marginBottom: 2,
  },
  cardNumber: {
    fontSize: 14,
    color: '#757575',
  },
  addPaymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addPaymentText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#424242',
    marginLeft: 10,
  },
  spacer: {
    flex: 1,
  },
  secureInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  secureInfoText: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    maxHeight: '90%',
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
});

export default Payment;