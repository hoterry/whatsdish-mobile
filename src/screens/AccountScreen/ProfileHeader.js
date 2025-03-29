import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Dimensions, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

const ProfileHeader = ({ avatar, userName, userPhone, onAvatarChange }) => {

  const { width, height } = useWindowDimensions();

  const isTablet = () => {
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const aspectRatio = screenHeight / screenWidth;
    return (
      (screenWidth >= 768 && aspectRatio <= 1.6) || 
      (Platform.OS === 'ios' && Platform.isPad)    
    );
  };

  const tablet = isTablet();
  const avatarSize = tablet ? 120 : 80;
  const borderRadius = avatarSize / 2;
  const iconSize = tablet ? 20 : 16;
  const editIconSize = tablet ? 32 : 24;
  const editIconBorderRadius = editIconSize / 2;
  const userNameSize = tablet ? 30 : 24;
  const userPhoneSize = tablet ? 18 : 14;
  
  const pickImage = async () => {
    if (__DEV__) {
      console.log('[ProfileHeader] Picking image...');
    }
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        if (__DEV__) {
          console.log('[ProfileHeader] Image selected:', result.assets[0].uri);
        }
        onAvatarChange(result.assets[0].uri);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('[ProfileHeader] Error picking image:', error);
      }
      Alert.alert('Error', 'Could not select image. Please try again.');
    }
  };


  const dynamicStyles = {
    avatarShadowIOS: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: tablet ? 3 : 2 },
      shadowOpacity: 0.1,
      shadowRadius: tablet ? 6 : 4,
      borderRadius: borderRadius,
    },
    avatar: {
      width: avatarSize,
      height: avatarSize,
      borderRadius: borderRadius,
      borderWidth: tablet ? 4 : 3,
      borderColor: '#fff',
    },
    avatarAndroid: {
      width: avatarSize,
      height: avatarSize,
      borderRadius: borderRadius,
      borderWidth: tablet ? 4 : 3,
      borderColor: '#fff',
      elevation: tablet ? 8 : 5,
    },
    editIconContainer: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: '#000',
      borderRadius: editIconBorderRadius,
      width: editIconSize,
      height: editIconSize,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: tablet ? 3 : 2,
      borderColor: '#fff',
    },
    userName: {
      fontSize: userNameSize,
      fontWeight: '600',
      color: '#000',
    },
    userPhone: {
      fontSize: userPhoneSize,
      color: '#666',
      marginTop: tablet ? 6 : 4,
    },
  };

  return (
    <View style={[styles.header, { paddingTop: tablet ? 20 : 10, marginBottom: tablet ? 20 : 5 }]}>
      <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
        {Platform.OS === 'ios' ? (
          <View style={dynamicStyles.avatarShadowIOS}>
            <Image source={{ uri: avatar }} style={dynamicStyles.avatar} />
          </View>
        ) : (
          <Image source={{ uri: avatar }} style={dynamicStyles.avatarAndroid} />
        )}
        <View style={dynamicStyles.editIconContainer}>
          <Ionicons name="camera" size={iconSize} color="#fff" />
        </View>
      </TouchableOpacity>
      
      <Text style={dynamicStyles.userName} numberOfLines={1}>
        {userName || 'Set your name'}
      </Text>
      
      <Text style={dynamicStyles.userPhone} numberOfLines={1}>
        {userPhone || 'Add phone number'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    width: '100%',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
});

export default ProfileHeader;