// components/ScreenWrapper.js
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

const ScreenWrapper = ({ children, style }) => {
  return <SafeAreaView style={[styles.wrapper, style]}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 0, 
    backgroundColor: '#fff', 
  },
});

export default ScreenWrapper;
