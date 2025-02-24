import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

// 使用 Google Places API 获取地址建议
const fetchAddressSuggestions = async (query) => {
  const apiKey = 'AIzaSyCJ3SliYpQDIHEOtQYTlDUXP5DLpSejgiA';  // 请替换为你的 Google API 密钥
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=address&key=${apiKey}`;

  try {
    const response = await fetch(url); // 使用 fetch 请求数据
    const data = await response.json(); // 解析 JSON 数据

    if (data.status === 'OK') {
      const suggestions = data.predictions.map((item) => item.description); // 提取地址建议
      return suggestions;
    } else {
      console.error('Error fetching address suggestions:', data.error_message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching address suggestions:', error);
    return [];
  }
};

function AddressPicker({ navigation }) {
  const [newAddress, setNewAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const route = useRoute();
  const updateAddress = route.params?.updateAddress;

  // 使用 ref 保持输入框焦点
  const inputRef = useRef(null);

  // 每当输入变化时，获取地址建议
  useEffect(() => {
    if (newAddress.length > 0) {
      const fetchSuggestions = async () => {
        const results = await fetchAddressSuggestions(newAddress);
        setSuggestions(results); // 更新地址建议
      };
      fetchSuggestions();
    } else {
      setSuggestions([]); // 如果输入为空，则清空建议
    }
  }, [newAddress]);

  const handleSaveAddress = () => {
    if (!newAddress.trim()) {
      Alert.alert('Invalid Address', 'Please enter a valid address.');
    } else {
      if (updateAddress) {
        updateAddress(newAddress); // 调用父组件更新地址
        navigation.goBack(); // 返回上一页
      }
    }
  };

  const handleSelectAddress = (address) => {
    setNewAddress(address); // 设置选择的地址
    setSuggestions([]); // 清空地址建议列表
    if (updateAddress) {
      updateAddress(address); // 立即更新地址
      navigation.goBack(); // 选择地址后直接返回
    }
    // 保持输入框焦点
    inputRef.current.focus();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Your Address</Text>
      <TextInput
        ref={inputRef} // 设置 ref
        style={styles.input}
        placeholder="Enter new address"
        value={newAddress}
        onChangeText={setNewAddress} // 每次输入更新状态
      />

      {/* 显示地址建议列表 */}
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectAddress(item)}>
              <View style={styles.suggestionItem}>
                <Text style={styles.suggestionText}>{item}</Text>
              </View>
            </TouchableOpacity>
          )}
          style={styles.suggestionList} // 建议列表的样式
        />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
        <Text style={styles.saveButtonText}>Save Address</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',  // 设置背景色
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',  // 更深的字体颜色
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,  // 给输入框加点阴影
  },
  suggestionList: {
    maxHeight: 200,  // 设置建议列表的最大高度，防止溢出
    marginBottom: 20,  // 建议列表下方的间距
  },
  suggestionItem: {
    paddingVertical: 12,  // 增加垂直间距
    paddingHorizontal: 15,  // 增加水平间距
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 5,  // 边角圆滑处理
    alignItems: 'flex-start',  // 内容左对齐
  },
  suggestionText: {
    fontSize: 18,
    color: '#444',  // 更深的文字颜色
  },
  saveButton: {
    backgroundColor: '#000',  // 设置黑色背景
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 5,
  },
  saveButtonText: {
    color: '#fff',  // 白色文字
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AddressPicker;

