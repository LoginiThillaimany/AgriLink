// app/useraccount.js
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';

export default function UserAccountPage() {
  const [userData, setUserData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    userType: '',
    location: '',
    joinDate: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80');
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    refreshCurrentPassword(); // Load current password on component mount
  }, []);

  // Refresh password when page is focused (e.g., after password reset)
  useFocusEffect(
    useCallback(() => {
      refreshCurrentPassword();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData) {
        const user = JSON.parse(storedUserData);
        setUserData({
          fullName: user.fullName || '',
          phoneNumber: user.phoneNumber || '',
          email: user.email || '',
          userType: user.userType || '',
          location: user.location || 'Not specified',
          joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }) : 'Recently joined'
        });
      } else {
        Alert.alert('Error', 'No user data found. Please login again.');
        router.replace('/login');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      saveProfileChanges();
    } else {
      setIsEditing(true);
      // Clear password fields when entering edit mode
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
    }
  };

  const togglePasswordChange = async () => {
    setIsChangingPassword(!isChangingPassword);
    if (!isChangingPassword) {
      // Load current password when starting password change
      await refreshCurrentPassword();
      // Clear new password fields for user input
      setNewPassword('');
      setConfirmPassword('');
      // Force clear any browser autofill
      setTimeout(() => {
        setNewPassword('');
        setConfirmPassword('');
      }, 100);
    }
  };

  const refreshCurrentPassword = async () => {
    try {
      const storedPassword = await AsyncStorage.getItem('userPassword');
      if (storedPassword) {
        // Show the actual password text (read-only)
        setCurrentPassword(storedPassword);
      } else {
        // If no password stored, show message
        setCurrentPassword('Password not found - please re-login');
      }
    } catch (error) {
      console.error('Error loading current password:', error);
      setCurrentPassword('Password not found - please re-login');
    }
  };

  const saveProfileChanges = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log('Token retrieved:', token ? 'Token exists' : 'No token found');
      
      if (!token) {
        Alert.alert('Error', 'Please login again');
        router.replace('/login');
        return;
      }

      // First update profile
      console.log('Sending profile update request...');
      const response = await fetch('http://localhost:5000/api/v1/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: userData.fullName,
          phoneNumber: userData.phoneNumber,
          email: userData.email,
          location: userData.location
        }),
      });

      console.log('Profile update response status:', response.status);
      const data = await response.json();
      console.log('Profile update response data:', data);
      
      if (!response.ok) {
        Alert.alert('Error', data.message || 'Failed to update profile');
        return;
      }

      // Update stored user data with fresh data from MongoDB
      await AsyncStorage.setItem('userData', JSON.stringify(data.data.user));

      // If password change is requested, handle it
      if (isChangingPassword && newPassword && confirmPassword) {
        if (newPassword !== confirmPassword) {
          Alert.alert('Error', 'New passwords do not match');
          return;
        }

        if (newPassword.length < 6) {
          Alert.alert('Error', 'New password must be at least 6 characters');
          return;
        }

        // Get the actual current password from stored data
        const actualCurrentPassword = await AsyncStorage.getItem('userPassword');
        if (!actualCurrentPassword) {
          Alert.alert('Error', 'Password not found. Please re-login to change password.');
          return;
        }

        const passwordResponse = await fetch('http://localhost:5000/api/v1/auth/change-password', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            currentPassword: actualCurrentPassword,
            newPassword
          }),
        });

        const passwordData = await passwordResponse.json();
        
        if (passwordResponse.ok) {
          // Update stored user data and password
          await AsyncStorage.setItem('userData', JSON.stringify(data.data.user));
          await AsyncStorage.setItem('userPassword', newPassword); // Store new password
          
          // Reload user data to show updated information
          await loadUserData();
          
          // Refresh the current password field to show the new password
          setCurrentPassword(newPassword);
          
          Alert.alert('Success', 'Profile and password updated successfully');
          setIsEditing(false);
          setIsChangingPassword(false);
          setNewPassword('');
          setConfirmPassword('');
          return;
        } else {
          Alert.alert('Error', passwordData.message || 'Failed to change password');
          return;
        }
      }

      // Profile updated successfully (no password change)
      // Reload user data to show updated information
      await loadUserData();
      
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };


  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera roll permissions to change your profile picture.');
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera permissions to take a photo.');
      return;
    }

    // Launch camera
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Choose from Library',
          onPress: pickImage,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <TouchableOpacity onPress={showImageOptions}>
          <Image 
            source={{ uri: profileImage }}
            style={styles.profileImage}
          />
          <View style={styles.cameraIcon}>
            <Ionicons name="camera" size={20} color="white" />
          </View>
        </TouchableOpacity>
        
        <Text style={styles.userName}>{userData.fullName}</Text>
        <Text style={styles.userType}>{userData.userType === 'farmer' ? 'Farmer' : 'Consumer'}</Text>
        <Text style={styles.joinDate}>Member since {userData.joinDate}</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            placeholder="Full Name"
            placeholderTextColor="#999"
            value={userData.fullName}
            onChangeText={(text) => setUserData({...userData, fullName: text})}
            autoCapitalize="words"
            editable={isEditing}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            placeholder="Phone Number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={userData.phoneNumber}
            onChangeText={(text) => setUserData({...userData, phoneNumber: text})}
            editable={isEditing}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            placeholder="Email Address"
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={userData.email}
            onChangeText={(text) => setUserData({...userData, email: text})}
            autoCapitalize="none"
            editable={isEditing}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            placeholder="Location"
            placeholderTextColor="#999"
            value={userData.location}
            onChangeText={(text) => setUserData({...userData, location: text})}
            editable={isEditing}
          />
        </View>

        {isEditing && isChangingPassword && (
          <View style={styles.passwordSection}>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.currentPasswordInput]}
                placeholder="Current Password"
                placeholderTextColor="#999"
                secureTextEntry={false}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                editable={false}
              />
            </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
                placeholder="New Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
                value={newPassword}
                onChangeText={setNewPassword}
                autoComplete="new-password"
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoComplete="new-password"
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>
          </View>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.button, isEditing ? styles.saveButton : styles.editButton]}
          onPress={toggleEdit}
        >
          <Ionicons 
            name={isEditing ? "checkmark-circle" : "create-outline"} 
            size={20} 
            color="white" 
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Text>
        </TouchableOpacity>

         {isEditing && !isChangingPassword && (
          <TouchableOpacity 
            style={[styles.button, styles.passwordButton]}
             onPress={togglePasswordChange}
          >
            <Ionicons name="key-outline" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
        )}

         {isEditing && isChangingPassword && (
           <TouchableOpacity 
             style={[styles.button, styles.cancelPasswordButton]}
             onPress={togglePasswordChange}
           >
             <Ionicons name="close-circle" size={20} color="white" style={styles.buttonIcon} />
             <Text style={styles.buttonText}>Cancel Password Change</Text>
           </TouchableOpacity>
         )}

        {isEditing && (
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={() => {
              // Reset to original data and exit edit mode
              loadUserData();
              setIsEditing(false);
              setIsChangingPassword(false);
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
            }}
          >
            <Ionicons name="close-circle" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.replace('/login')}>
          <Ionicons name="log-out-outline" size={22} color="#E53935" />
          <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#1B5E20',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  cameraIcon: {
    position: 'absolute',
    right: 10,
    bottom: 20,
    backgroundColor: '#1B5E20',
    borderRadius: 15,
    padding: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userType: {
    fontSize: 16,
    color: '#1B5E20',
    fontWeight: '500',
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  joinDate: {
    fontSize: 14,
    color: '#666',
  },
  formSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  inputDisabled: {
    color: '#666',
  },
  eyeIcon: {
    padding: 5,
  },
  actionButtons: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#1B5E20',
  },
  saveButton: {
    backgroundColor: '#2E7D32',
  },
  cancelButton: {
    backgroundColor: '#757575',
  },
  passwordButton: {
    backgroundColor: '#FF9800',
  },
  cancelPasswordButton: {
    backgroundColor: '#E53935',
  },
  passwordSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  currentPasswordInput: {
    backgroundColor: '#f8f9fa',
    color: '#333',
    fontWeight: '500',
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  logoutText: {
    color: '#E53935',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#1B5E20',
    fontWeight: '500',
  },
});