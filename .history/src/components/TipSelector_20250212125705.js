// TipSelector.js
import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

const TipSelector = ({
  tipPercentage,
  calculatedTip,
  tipCustom,
  handleTipPercentageSelect,
  handleCustomTipChange,
}) => {
  return (
    <View>
      {/* 顯示小費金額 */}
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>
          Tip {tipPercentage > 0 ? `(${tipPercentage}%)` : '(Custom):'}
        </Text>
        <Text style={styles.priceValue}>${calculatedTip.toFixed(2)}</Text>
      </View>

      {/* 小費選擇按鈕 */}
      <View style={styles.tipButtonsContainer}>
        <TouchableOpacity
          onPress={() => handleTipPercentageSelect(10)}
          style={styles.tipButton}
        >
          <Text style={styles.tipButtonText}>10%</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTipPercentageSelect(15)}
          style={styles.tipButton}
        >
          <Text style={styles.tipButtonText}>15%</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTipPercentageSelect(20)}
          style={styles.tipButton}
        >
          <Text style={styles.tipButtonText}>20%</Text>
        </TouchableOpacity>

        {/* 自定義小費輸入框 */}
        <TextInput
          style={styles.tipInput}
          placeholder="Custom Tip$"
          keyboardType="numeric"
          placeholderTextColor="#ffffff"
          value={tipCustom}
          textAlign="center"
          onChangeText={handleCustomTipChange}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tipButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  tipButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipInput: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TipSelector;