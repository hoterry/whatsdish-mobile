// components/ScreenWrapper.js
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

const ScreenWrapper = ({ children, style }) => {
  return <SafeAreaView style={[styles.wrapper, style]}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 0, // 默认顶部内边距
    backgroundColor: '#fff', // 默认背景色，可以根据需求调整
  },
});

export default ScreenWrapper;
