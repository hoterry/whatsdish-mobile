import React from 'react';
import { View, Text, StyleSheet, Platform, Dimensions, useWindowDimensions } from 'react-native';

const ProfileSection = ({ title, children }) => {
  const { width } = useWindowDimensions();

  const isTablet = () => {
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const aspectRatio = screenHeight / screenWidth;
    return (
      (screenWidth >= 768 && aspectRatio <= 1.6) || 
      (Platform.OS === 'ios' && Platform.isPad)
    );
  };

  const tablet = isTablet();
  const titleSize = tablet ? 18 : 16;
  const marginTop = tablet ? 30 : 20;
  const marginBottom = tablet ? 15 : 10;
  const marginLeft = tablet ? 8 : 4;
  const borderRadius = tablet ? 20 : 16;
  
  return (
    <View style={[styles.section, { marginTop: marginTop }]}>
      <Text style={[styles.sectionTitle, { 
        fontSize: titleSize, 
        marginBottom: marginBottom,
        marginLeft: marginLeft
      }]}>
        {title}
      </Text>
      
      {Platform.OS === 'ios' ? (
        <View style={[styles.cardShadowIOS, { 
          borderRadius: borderRadius,
          width: '100%' 
        }]}>
          <View style={[styles.cardContentIOS, { 
            borderRadius: borderRadius,
            width: '100%'
          }]}>
            {children}
          </View>
        </View>
      ) : (
        <View style={[styles.cardAndroid, { 
          borderRadius: borderRadius,
          width: '100%'
        }]}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    width: '100%',
    paddingHorizontal: 0, 
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 16, 
  },
  cardAndroid: {
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 3, // 
    alignSelf: 'stretch', //
  },
  cardShadowIOS: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, 
    shadowRadius: 8,
    backgroundColor: 'transparent',
    alignSelf: 'stretch', 
  },
  cardContentIOS: {
    backgroundColor: '#fff',
    overflow: 'hidden',
    alignSelf: 'stretch', 
  }
});

export default ProfileSection;