import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const { width } = Dimensions.get('window');

const CustomSplashScreen = ({ onAnimationFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationFinish();
    }, 3000); // 動畫持續3秒

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/wd-animation.json')}
        autoPlay
        loop={false}
        onAnimationFinish={() => SplashScreen.hideAsync()}
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  animation: {
    width: width * 0.6,
    height: width * 0.6,
  },
});

export default CustomSplashScreen;
