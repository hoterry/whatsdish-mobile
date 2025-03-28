import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  Platform,
  useWindowDimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import useUserFetcher from '../context/FetchUser';
import { LanguageManager } from '../components/LanguageManager'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ProfileHeader from '../components/ProfileHeader';
import ProfileSection from '../components/ProfileSection';
import ProfileItem from '../components/ProfileItem';
import LogoutButton from '../components/LogoutButton';
import LogoutConfirmModal from '../components/LogoutConfirmModal';
import LanguageSelector from '../components/LanguageSelector';
import ProfileEditModal from '../components/ProfileEditModal';
import ComingSoonModal from '../components/ComingSoonModal';
import HelpCenterModal from '../components/HelpCenterModal';
import DeleteAccountButton from '../components/DeleteAccountButton';
const translations = {
  EN: {
    personalInfo: "Personal Information",
    fullName: "Full Name",
    addName: "Add your name",
    email: "Email",
    addEmail: "Add your email",
    phone: "Phone",
    phoneVerified: "Verified",
    accountDetails: "Account Details",
    accountId: "Account ID",
    language: "Language",
    notAvailable: "Not available",
    settingsSupport: "Settings & Support",
    promotions: "Promotions",
    viewOffers: "View offers",
    helpCenter: "Help Center",
    support: "Support",
    logout: "Logout",
    appVersion: "App Version 1.0.0",
    errorLoggingOut: "Error",
    logoutFailed: "Logout failed. Please try again later.",
    comingSoon: "Coming Soon",
    comingSoonMessage: "This feature will be available in a future update."
  },
  ZH: {
    personalInfo: "個人資料",
    fullName: "姓名",
    addName: "添加姓名",
    email: "電子郵件",
    addEmail: "添加電子郵件",
    phone: "電話號碼",
    phoneVerified: "已驗證",
    accountDetails: "帳戶詳情",
    accountId: "帳戶 ID",
    language: "語言",
    notAvailable: "暫不可用",
    settingsSupport: "設置與支持",
    promotions: "促銷活動",
    viewOffers: "查看優惠",
    helpCenter: "幫助中心",
    support: "支持",
    logout: "登出",
    appVersion: "應用版本 1.0.0",
    errorLoggingOut: "錯誤",
    logoutFailed: "登出失敗，請稍後再試。",
    comingSoon: "即將推出",
    comingSoonMessage: "此功能將在未來更新中提供。"
  }
};

const AccountScreen = ({ setIsAuthenticated }) => {
  const { userData, setUserData, fetchUserData } = useUserFetcher();
  const [editingField, setEditingField] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [avatar, setAvatar] = useState(userData.avatar || 'https://res.cloudinary.com/dfbpwowvb/image/upload/v1740016738/icon_green_CMYK-01_gtijo1.jpg');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [confirmLogoutVisible, setConfirmLogoutVisible] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [showHelpCenterModal, setShowHelpCenterModal] = useState(false);
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isTablet = () => {
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const aspectRatio = screenHeight / screenWidth;
    return (
      (screenWidth >= 768 && aspectRatio <= 1.6) || 
      (Platform.OS === 'ios' && Platform.isPad)
    );
  };

  const getPadding = () => {
    if (isTablet()) {
      return { horizontal: 24, bottom: 32 };
    }
    return { horizontal: 16, bottom: 60 };
  };

  const refreshUserData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchUserData();
      if (__DEV__) {
        console.log('[AccountScreen] User data refreshed successfully');
      }
    } catch (error) {
      if (__DEV__) {
        console.error('[AccountScreen] Error refreshing user data:', error);
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchUserData]);

  useEffect(() => {
    if (__DEV__) {
      console.log('[AccountScreen] Component mounted, fetching user data...');
    }
    refreshUserData();
  }, [refreshUserData]);

  const handleAvatarChange = (newAvatarUri) => {
    setAvatar(newAvatarUri);
    setUserData(prev => ({
      ...prev,
      avatar: newAvatarUri
    }));
  };

  const handleEditField = (field) => {
    setEditingField(field);
    setEditModalVisible(true);
  };

  const handleUpdateField = async (field, value) => {
    try {
      setUserData(prev => {
        if (field === 'name') {
          return { ...prev, name: value };
        } else if (field === 'email') {
          return { ...prev, email: value };
        }
        return prev;
      });
      
      await fetchUserData();
    } catch (error) {
      if (__DEV__) {
        console.error(`[AccountScreen] Error updating ${field}:`, error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      if (__DEV__) {
        console.log('[AccountScreen] Logging out...');
      }
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('accountId');
      
      // Just set isAuthenticated to false and let the conditional rendering handle navigation
      setIsAuthenticated(false);
      
    } catch (error) {
      if (__DEV__) {
        console.error('[AccountScreen] Logout error:', error);
      }
      Alert.alert(
        translations['EN'].errorLoggingOut, 
        translations['EN'].logoutFailed
      );
    } finally {
      setConfirmLogoutVisible(false);
    }
  };

  const formatAccountId = (accountId) => {
    if (!accountId) return translations['EN'].notAvailable;
    const length = accountId.length;
    return `${'•'.repeat(4)} ${accountId.slice(-4)}`;
  };

  const handleLanguageChange = (selectedLanguage) => {
    setUserData((prevData) => ({
      ...prevData,
      languagePreference: selectedLanguage,
    }));
    setShowLanguageModal(false);
  };

  const padding = getPadding();

  return (
    <LanguageManager>
      {({ t, language }) => {
        const texts = translations[language] || translations['EN'];
        
        return (
          <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle="dark-content" />
            
            <ScrollView
              contentContainerStyle={[
                styles.scrollContent,
                {
                  paddingBottom: padding.bottom + insets.bottom,
                }
              ]}
              showsVerticalScrollIndicator={false}
              contentInsetAdjustmentBehavior="automatic"
            >
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons 
                  name="chevron-back" 
                  size={isTablet() ? 32 : 28} 
                  color="#000" 
                />
              </TouchableOpacity>

              <ProfileHeader 
                avatar={avatar}
                userName={userData.name}
                userPhone={userData.phone}
                onAvatarChange={handleAvatarChange}
                language={language}
              />
              
              <ProfileSection title={texts.personalInfo}>
                <ProfileItem 
                  icon="person" 
                  label={texts.fullName} 
                  value={userData.name || texts.addName} 
                  onPress={() => handleEditField('name')}
                />
                <ProfileItem 
                  icon="mail" 
                  label={texts.email} 
                  value={userData.email || texts.addEmail} 
                  onPress={() => handleEditField('email')}
                />
                <ProfileItem 
                  icon="call" 
                  label={texts.phone} 
                  value={userData.phone} 
                  rightComponent={
                    <View style={styles.verifiedContainer}>
                      <Text style={[
                        styles.verifiedText,
                        { fontSize: isTablet() ? 14 : 12 }
                      ]}>
                        {texts.phoneVerified}
                      </Text>
                    </View>
                  }
                  editable={false}
                  isLast
                />
              </ProfileSection>
              
              <ProfileSection title={texts.accountDetails}>
                <ProfileItem 
                  icon="card" 
                  label={texts.accountId} 
                  value={formatAccountId(userData.accountId)} 
                  editable={false}
                />
                <ProfileItem 
                  icon="language" 
                  label={texts.language} 
                  value={language === 'ZH' ? '中文' : 'English'} 
                  onPress={() => setShowLanguageModal(true)}
                  isLast
                />
              </ProfileSection>

              <ProfileSection title={texts.settingsSupport}>
                <ProfileItem 
                  icon="pricetag" 
                  label={texts.promotions} 
                  value={texts.viewOffers} 
                  onPress={() => setShowComingSoonModal(true)}
                />
                <ProfileItem 
                  icon="help-circle" 
                  label={texts.helpCenter} 
                  value={texts.support} 
                  onPress={() => setShowHelpCenterModal(true)}

                />
                <DeleteAccountButton setIsAuthenticated={setIsAuthenticated} language={language} isLast />
              </ProfileSection>

              <View style={[
                styles.bottomSection,
                { 
                  marginTop: isTablet() ? 32 : 24,
                  marginBottom: isTablet() ? 24 : 16
                }
              ]}>
                <LogoutButton 
                  onPress={() => setConfirmLogoutVisible(true)} 
                  text={texts.logout}
                />
                <Text style={[
                  styles.versionText,
                  { 
                    marginTop: isTablet() ? 16 : 12,
                    fontSize: isTablet() ? 16 : 14
                  }
                ]}>
                  {texts.appVersion}
                </Text>
              </View>
              


            </ScrollView>

            <ProfileEditModal
              visible={editModalVisible}
              onClose={() => setEditModalVisible(false)}
              fieldType={editingField}
              currentValue={editingField === 'name' ? userData.name : userData.email}
              language={language}
              onSave={handleUpdateField}
            />

            {showLanguageModal && (
              <LanguageSelector
                currentLanguage={language}
                onSelectLanguage={handleLanguageChange}
                onClose={() => setShowLanguageModal(false)}
              />
            )}

            <LogoutConfirmModal
              visible={confirmLogoutVisible}
              onCancel={() => setConfirmLogoutVisible(false)}
              onConfirm={handleLogout}
              language={language}
            />

            <ComingSoonModal
              visible={showComingSoonModal}
              onClose={() => setShowComingSoonModal(false)}
              title={texts.comingSoon}
              message={texts.comingSoonMessage}
              language={language}
            />

            <HelpCenterModal
              visible={showHelpCenterModal}
              onClose={() => setShowHelpCenterModal(false)}
              language={language}
            />

            {isRefreshing && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator 
                  size={isTablet() ? "large" : "small"} 
                  color="#000" 
                />
              </View>
            )}
          </SafeAreaView>
        );
      }}
    </LanguageManager>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollContent: {
    flexGrow: 1,
  },
  backButton: {
    marginTop: 12, 
    marginBottom: 6 
  },
  bottomSection: {
    alignItems: 'center',
  },
  versionText: {
    color: '#888',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  verifiedContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    color: '#666',
    fontWeight: '500'
  }
});

export default AccountScreen;