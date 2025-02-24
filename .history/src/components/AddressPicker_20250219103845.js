import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';

const fetchAddressSuggestions = async (query) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

  try {
    const response = await fetch(url); // 使用 fetch 请求数据
    const data = await response.json(); // 解析 JSON 数据

    if (data.length > 0) {
      const suggestions = data.map((item) => item.display_name); // 提取地址建议
      return suggestions;
    } else {
      console.error('Error fetching address suggestions');
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
      // 返回上一页时保存地址
      navigation.goBack();
    }
  };

  const handleSelectAddress = (address) => {
    setNewAddress(address); // 设置选择的地址
    setSuggestions([]); // 清空地址建议列表
    // 返回上一页并保存选择的地址
    navigation.goBack();
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
