import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LanguageContext } from '../context/LanguageContext';

const translations = {
  EN: {
    disclaimer: "Payment Disclaimer",
    content: `Prices may vary due to store updates. 
              Please verify final prices before completing payment.
              Payment information is securely processed and not stored.
              Any discrepancies should be reported to customer service.
              Taxes and additional fees may apply based on location.
              Refund policies are subject to the merchant's terms.`,
  },
  ZH: {
    disclaimer: "付款免責聲明",
    content: `由於商店更新，價格可能會有所變動。
              請在付款前確認最終價格。
              付款信息將安全處理，不會被存儲。
              如有任何差異，請聯繫客戶服務。
              稅費及額外費用可能因地區不同而有所變更。
              退款政策以商家條款為準。`,
  },
};

const PaymentDisclaimer = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language] || translations.EN;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.disclaimer}</Text>
      <Text style={styles.content}>{t.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  content: {
    fontSize: 10,
    color: '#666',
    lineHeight: 14,
  },
});

export default PaymentDisclaimer;
