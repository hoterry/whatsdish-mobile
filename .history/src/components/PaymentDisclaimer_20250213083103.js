import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PaymentDisclaimer = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.disclaimerText}>
        ⚠ **付款安全提示與免責聲明**
      </Text>
      <Text style={styles.disclaimerText}>
        - 本平台的支付系統已加密處理，以確保您的付款資訊安全。
      </Text>
      <Text style={styles.disclaimerText}>
        - 為防止詐欺，請確保您的支付方式為個人帳戶，並避免在公共網絡進行支付。
      </Text>
      <Text style={styles.disclaimerText}>
        - 本平台不會主動向您索取信用卡資訊或驗證碼，請勿向任何人提供相關資訊。
      </Text>
      <Text style={styles.disclaimerText}>
        - 所有價格以訂單提交時的顯示金額為準，實際收費可能因商店更新有所變動。
      </Text>
      <Text style={styles.disclaimerText}>
        - 交易完成後，若因商店價格調整或促銷活動變動，將不提供價格補差服務。
      </Text>
      <Text style={styles.disclaimerText}>
        - 若發生支付失敗、扣款異常等情況，請聯繫客服處理。
      </Text>
      <Text style={styles.disclaimerText}>
        - 本平台僅提供支付管道，所有交易糾紛應由用戶與商家協商解決。
      </Text>
      <Text style={styles.disclaimerText}>
        - 使用本支付系統即表示您同意我們的《付款條款與隱私政策》。
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  disclaimerText: {
    fontSize: 10,
    color: '#777',
    marginBottom: 4,
  },
});

export default PaymentDisclaimer;
