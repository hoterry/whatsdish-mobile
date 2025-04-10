import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LanguageContext } from '../../context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

const translations = {
  EN: {
    title: "Payment Security & Disclaimer",
    collapse: "Show less",
    expand: "Show more",
    sections: [
      {
        heading: "Payment Security",
        details: [
          "Our payment system is encrypted to ensure the security of your payment information.",
          "To prevent fraud, please ensure your payment method belongs to you and avoid making payments on public networks.",
          "We will never ask for your credit card details or verification code. Do not share such information with anyone.",
        ],
      },
      {
        heading: "Pricing & Charges",
        details: [
          "All prices are based on the amount displayed when the order is submitted. Actual charges may vary due to store updates.",
          "After a transaction is completed, we do not provide price adjustments due to store promotions or price changes.",
        ],
      },
      {
        heading: "Payment Issues",
        details: [
          "If payment fails or there are abnormal deductions, please contact customer service for assistance.",
          "This platform only provides a payment channel. All transaction disputes should be resolved between the user and the merchant.",
        ],
      },
      {
        heading: "Terms & Policy",
        details: [
          "By using this payment system, you agree to our Payment Terms and Privacy Policy.",
        ],
      },
    ],
  },
  ZH: {
    title: "付款安全提示與免責聲明",
    collapse: "收起",
    expand: "展開更多",
    sections: [
      {
        heading: "付款安全",
        details: [
          "本平台的支付系統已加密處理，以確保您的付款資訊安全。",
          "為防止詐欺，請確保您的支付方式為個人帳戶，並避免在公共網絡進行支付。",
          "本平台不會主動向您索取信用卡資訊或驗證碼，請勿向任何人提供相關資訊。",
        ],
      },
      {
        heading: "價格與費用",
        details: [
          "所有價格以訂單提交時的顯示金額為準，實際收費可能因商店更新有所變動。",
          "交易完成後，若因商店價格調整或促銷活動變動，將不提供價格補差服務。",
        ],
      },
      {
        heading: "付款問題",
        details: [
          "若發生支付失敗、扣款異常等情況，請聯繫客服處理。",
          "本平台僅提供支付管道，所有交易糾紛應由用戶與商家協商解決。",
        ],
      },
      {
        heading: "條款與政策",
        details: [
          "使用本支付系統即表示您同意我們的《付款條款與隱私政策》。",
        ],
      },
    ],
  },
};

const PaymentDisclaimer = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language] || translations.EN;
  const [expanded, setExpanded] = useState(false);

  // 只顯示第一部分，或根據用戶選擇顯示全部
  const sectionsToShow = expanded ? t.sections : [t.sections[0]];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
        </View>
        <Text style={styles.title}>{t.title}</Text>
      </View>
      
      <View style={styles.contentContainer}>
        {sectionsToShow.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.heading}>{section.heading}</Text>
            {section.details.map((detail, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.content}>{detail}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
      
      <TouchableOpacity 
        style={styles.toggleButton}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.toggleText}>
          {expanded ? t.collapse : t.expand}
        </Text>
        <Ionicons 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={16} 
          color="#555555" 
          style={styles.toggleIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  contentContainer: {
    marginBottom: 12,
  },
  section: {
    marginBottom: 12,
  },
  heading: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555555',
    marginBottom: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingRight: 6,
  },
  bullet: {
    fontSize: 12,
    color: '#999999',
    marginRight: 6,
    marginTop: 1,
  },
  content: {
    fontSize: 12,
    color: '#777777',
    flex: 1,
    lineHeight: 16,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#555555',
  },
  toggleIcon: {
    marginLeft: 4,
  }
});

export default PaymentDisclaimer;