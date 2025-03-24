import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Platform, 
  Alert,
  Modal,
  StatusBar,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import useUserFetcher from '../context/FetchUser';
import { LanguageManager } from '../components/LanguageManager'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const AccountScreen = ({ setIsAuthenticated }) => {
  const { userData, setUserData, fetchUserData } = useUserFetcher();
  const [editingField, setEditingField] = useState(null);
  const [avatar, setAvatar] = useState(userData.avatar || 'https://res.cloudinary.com/dfbpwowvb/image/upload/v1740016738/icon_green_CMYK-01_gtijo1.jpg');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [confirmLogoutVisible, setConfirmLogoutVisible] = useState(false);
  const navigation = useNavigation();

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

  const pickImage = async () => {
    if (__DEV__) {
      console.log('[AccountScreen] Picking image...');
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
          console.log('[AccountScreen] Image selected:', result.assets[0].uri);
        }
        setAvatar(result.assets[0].uri);

        setUserData(prev => ({
          ...prev,
          avatar: result.assets[0].uri
        }));
      }
    } catch (error) {
      if (__DEV__) {
        console.error('[AccountScreen] Error picking image:', error);
      }
      Alert.alert('Error', 'Could not select image. Please try again.');
    }
  };

  const showLogoutConfirmation = () => {
    setConfirmLogoutVisible(true);
  };

  const handleLogout = async () => {
    try {
      if (__DEV__) {
        console.log('[AccountScreen] Logging out...');
      }
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('accountId');
      setIsAuthenticated(false);
    } catch (error) {
      if (__DEV__) {
        console.error('[AccountScreen] Logout error:', error);
      }
      Alert.alert('Error', 'Logout failed. Please try again later.');
    } finally {
      setConfirmLogoutVisible(false);
    }
  };


  const formatAccountId = (accountId) => {
    if (!accountId) return 'Not available';
    const length = accountId.length;
    return `${'•'.repeat(4)} ${accountId.slice(-4)}`;
  };

  return (
    <LanguageManager>
      {({ t, language, showLanguageModal, setShowLanguageModal }) => (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <StatusBar barStyle="dark-content" />
          
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >

            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="chevron-back" size={28} color="#000" />
            </TouchableOpacity>

            <View style={styles.header}>
              <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
                <Image source={{ uri: avatar }} style={styles.avatar} />
                <View style={styles.editIconContainer}>
                  <Ionicons name="camera" size={16} color="#fff" />
                </View>
              </TouchableOpacity>
              
              <Text style={styles.userName} numberOfLines={1}>
                {userData.name || 'Set your name'}
              </Text>
              
              <Text style={styles.userPhone} numberOfLines={1}>
                {userData.phone || 'Add phone number'}
              </Text>
            </View>
            

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              <View style={styles.card}>
                <ProfileItem 
                  icon="person" 
                  label="Full Name" 
                  value={userData.name || 'Add your name'} 
                  onPress={() => setEditingField('name')}
                />
                <ProfileItem 
                  icon="mail" 
                  label="Email" 
                  value={userData.email || 'Add your email'} 
                  onPress={() => setEditingField('email')}
                />
                <ProfileItem 
                  icon="call" 
                  label="Phone" 
                  value={userData.phone || 'Add phone number'} 
                  onPress={() => setEditingField('phone')}
                  isLast
                />
              </View>
            </View>
            

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Details</Text>
              <View style={styles.card}>
                <ProfileItem 
                  icon="card" 
                  label="Account ID" 
                  value={formatAccountId(userData.accountId)} 
                  editable={false}
                />
                <ProfileItem 
                  icon="language" 
                  label="Language" 
                  value={language} 
                  onPress={() => setShowLanguageModal(true)}
                  isLast
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Settings & Support</Text>
              <View style={styles.card}>
                <ProfileItem 
                  icon="notifications" 
                  label="Notifications" 
                  value="Manage" 
                  onPress={() => {}}
                />
                <ProfileItem 
                  icon="pricetag" 
                  label="Promotions" 
                  value="View offers" 
                  onPress={() => {}}
                />
                <ProfileItem 
                  icon="help-circle" 
                  label="Help Center" 
                  value="Support" 
                  onPress={() => {}}
                  isLast
                />
              </View>
            </View>

            <View style={styles.bottomSection}>
              <TouchableOpacity 
                style={styles.logoutButton} 
                onPress={showLogoutConfirmation}
              >
                <Ionicons name="log-out-outline" size={20} color="#000" />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
              
              <Text style={styles.versionText}>App Version 1.0.0</Text>
            </View>
          </ScrollView>

          {showLanguageModal && (
            <LanguageSelector
              currentLanguage={language}
              onSelectLanguage={(selectedLanguage) => {
                setUserData((prevData) => ({
                  ...prevData,
                  languagePreference: selectedLanguage,
                }));
                setShowLanguageModal(false);
              }}
              onClose={() => setShowLanguageModal(false)}
            />
          )}

          <Modal
            visible={confirmLogoutVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setConfirmLogoutVisible(false)}
          >
            <BlurView intensity={80} style={styles.modalBlur}>
              <View style={styles.confirmModal}>
                <Text style={styles.confirmTitle}>Logout</Text>
                <Text style={styles.confirmText}>
                  Are you sure you want to logout from your account?
                </Text>
                <View style={styles.confirmButtons}>
                  <TouchableOpacity 
                    style={[styles.confirmButton, styles.cancelButton]} 
                    onPress={() => setConfirmLogoutVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.confirmButton, styles.logoutConfirmButton]} 
                    onPress={handleLogout}
                  >
                    <Text style={styles.logoutConfirmText}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </Modal>

          {isRefreshing && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#000" />
            </View>
          )}
        </SafeAreaView>
      )}
    </LanguageManager>
  );
};

// 个人资料项组件
const ProfileItem = ({ icon, label, value, onPress, editable = true, isLast = false }) => (
  <TouchableOpacity 
    style={[
      styles.profileItem, 
      isLast ? null : styles.profileItemBorder
    ]} 
    onPress={editable ? onPress : null}
    disabled={!editable}
  >
    <View style={styles.profileItemLeft}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={18} color="#000" />
      </View>
      <Text style={styles.profileLabel}>{label}</Text>
    </View>
    
    <View style={styles.profileItemRight}>
      <Text 
        style={[
          styles.profileValue,
          editable ? null : styles.profileValueDisabled
        ]}
        numberOfLines={1}
      >
        {value}
      </Text>
      {editable && (
        <Ionicons name="chevron-forward" size={18} color="#999" />
      )}
    </View>
  </TouchableOpacity>
);

// 语言选择器组件
const LanguageSelector = ({ currentLanguage, onSelectLanguage, onClose }) => (
  <Modal
    transparent={true}
    animationType="slide"
    visible={true}
    onRequestClose={onClose}
  >
    <BlurView intensity={80} style={styles.modalBlur}>
      <View style={styles.languageModal}>
        <View style={styles.languageModalHeader}>
          <Text style={styles.languageModalTitle}>Select Language</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.languageOption,
            currentLanguage === 'EN' ? styles.languageOptionSelected : null
          ]} 
          onPress={() => onSelectLanguage('EN')}
        >
          <Text style={styles.languageOptionText}>English</Text>
          {currentLanguage === 'EN' && (
            <Ionicons name="checkmark" size={24} color="#000" />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.languageOption,
            currentLanguage === 'ZH' ? styles.languageOptionSelected : null
          ]} 
          onPress={() => onSelectLanguage('ZH')}
        >
          <Text style={styles.languageOptionText}>中文</Text>
          {currentLanguage === 'ZH' && (
            <Ionicons name="checkmark" size={24} color="#000" />
          )}
        </TouchableOpacity>
      </View>
    </BlurView>
  </Modal>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 10,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#000',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  profileItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileLabel: {
    fontSize: 16,
    color: '#333',
  },
  profileItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '50%',
  },
  profileValue: {
    fontSize: 16,
    color: '#999',
    marginRight: 8,
    textAlign: 'right',
  },
  profileValueDisabled: {
    color: '#666',
  },
  bottomSection: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  logoutText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 8,
  },
  versionText: {
    marginTop: 16,
    color: '#999',
    fontSize: 12,
  },
  modalBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  languageModal: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    paddingBottom: 20,
  },
  languageModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  languageModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    padding: 4,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  languageOptionSelected: {
    backgroundColor: '#f8f8f8',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#333',
  },
  confirmModal: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  confirmText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f1f1',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  logoutConfirmButton: {
    backgroundColor: '#000000',
  },
  logoutConfirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
});

export default AccountScreen;