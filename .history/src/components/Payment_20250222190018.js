const Payment = () => {
  const { language } = useContext(LanguageContext);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedCards, setSavedCards] = useState([]); // 新增狀態來保存信用卡資料

  // 獲取信用卡資料的函數
  const fetchSavedCards = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        console.error('No token found in SecureStore');
        setLoading(false);
        return;
      }

      const response = await fetch('https://dev.whatsdish.com/api/profile/payment-methods', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('Fetched saved cards:', data.cards);

      if (data?.cards?.length > 0) {
        setSavedCards(data.cards); // 更新信用卡列表
        const defaultCard = data.cards.find(card => card.data.is_default) || data.cards[0];
        setSelectedMethod({
          type: defaultCard.data.bin.brand,
          last4: defaultCard.data.masked_pan.slice(-4),
        });
      } else {
        setSelectedMethod(null); // 如果沒有信用卡，清空選擇
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始載入時獲取信用卡資料
  useEffect(() => {
    fetchSavedCards();
  }, []);

  // 當模態視窗關閉時，重新獲取信用卡資料
  const handleCloseModal = () => {
    setModalVisible(false);
    fetchSavedCards(); // 重新獲取信用卡資料
  };

  const handleSelectMethod = (method) => {
    console.log('Selected method:', method);
    setSelectedMethod({
      type: method.data.bin.brand,
      last4: method.data.masked_pan.slice(-4),
    });
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{language === 'ZH' ? '付款' : 'Payment'}</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <TouchableOpacity style={styles.paymentContainer} onPress={() => setModalVisible(true)}>
            <View style={styles.paymentInfo}>
              {selectedMethod ? (
                <>
                  <FontAwesome
                    name={
                      selectedMethod.type.includes('VISA')
                        ? 'cc-visa'
                        : selectedMethod.type.includes('MASTER')
                        ? 'cc-mastercard'
                        : selectedMethod.type.includes('AMERICAN EXPRESS')
                        ? 'cc-amex'
                        : 'credit-card'
                    }
                    size={32}
                    color={
                      selectedMethod.type.includes('VISA')
                        ? '#1a73e8'
                        : selectedMethod.type.includes('MASTER')
                        ? '#f79e1b'
                        : selectedMethod.type.includes('AMERICAN EXPRESS')
                        ? '#002663'
                        : 'gray'
                    }
                  />
                  <Text style={styles.paymentText}>
                    {selectedMethod.type} **** {selectedMethod.last4}
                  </Text>
                </>
              ) : (
                <Text style={styles.paymentText}>
                  {language === 'ZH' ? '選擇付款方式' : 'Select Payment Method'}
                </Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={24} color="black" />
          </TouchableOpacity>
        )}

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <PaymentMethod
                onSelectMethod={handleSelectMethod}
                onClose={handleCloseModal} // 使用新的關閉函數
              />
            </View>
          </View>
        </Modal>

        <View style={styles.divider} />

        <PaymentDisclaimer />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {},
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    width: '100%',
  },
  paymentInfo: { flexDirection: 'row', alignItems: 'center' },
  paymentText: { fontSize: 18, marginLeft: 10 },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: '#fff', borderRadius: 10, padding: 20, marginHorizontal: 20 },
  divider: { marginTop: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 10 },
  buttonContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: '#ddd' },
  placeOrderButton: { backgroundColor: '#ff6600', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  placeOrderText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
});

export default Payment;

