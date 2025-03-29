import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Platform, 
  Dimensions,
  PixelRatio,
  useWindowDimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const LogoutButton = ({ onPress, text = "Logout" }) => {
  const { width: windowWidth } = useWindowDimensions();

  const isIOS = Platform.OS === 'ios';

  const isTablet = () => {
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const aspectRatio = screenHeight / screenWidth;
    return (
      (screenWidth >= 768 && aspectRatio <= 1.6) || 
      (Platform.OS === 'ios' && Platform.isPad)
    );
  };

  const getScale = () => {
    if (isTablet()) {
      return windowWidth / 768;
    }
    return windowWidth / 390;
  };

  const normalize = (size) => {
    const SCALE = getScale();
    const newSize = size * SCALE;
    
    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(newSize));
    }
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  };

  const getButtonWidth = () => {
    if (isTablet()) {
      return isIOS ? '50%' : '40%';
    }
    return isIOS ? '80%' : '70%';
  };

  const blackGradientColors = ['#000000', '#333333'];

  if (isIOS) {
    return (
      <TouchableOpacity
        style={[
          styles.container, 
          styles.iosContainer,
          { 
            width: getButtonWidth(),
            height: normalize(48),
            borderRadius: normalize(12),
          }
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={blackGradientColors}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons 
            name="log-out-outline" 
            size={normalize(18)} 
            color="#FFF" 
            style={{ marginRight: normalize(8) }} 
          />
          <Text style={[
            styles.text, 
            { fontSize: normalize(16) }
          ]}>
            {text}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.container, 
        styles.androidContainer,
        { 
          width: getButtonWidth(),
          height: normalize(44),
          borderRadius: normalize(22),
        }
      ]}
      onPress={onPress}
      android_ripple={{ color: 'rgba(255, 255, 255, 0.2)', borderless: false }}
    >
      <Ionicons 
        name="exit-outline" 
        size={normalize(16)} 
        color="#FFF" 
        style={{ marginRight: normalize(8) }} 
      />
      <Text style={[
        styles.text, 
        { 
          fontSize: normalize(14),
          letterSpacing: normalize(1)
        }
      ]}>
        {text.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    alignSelf: 'center', // 使按钮居中
    marginVertical: 20,
  },
  iosContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  androidContainer: {
    backgroundColor: '#000000', // 黑色背景
    flexDirection: 'row',
    elevation: 3,
  },
  gradient: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    color: '#FFFFFF',
  }
});

export default LogoutButton;