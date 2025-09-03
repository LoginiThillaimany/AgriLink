// app/useraccount.js
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';

export default function UserAccountPage() {
  const [userData, setUserData] = useState({
    fullName: 'John Farmer',
    phoneNumber: '+1 (555) 123-4567',
    email: 'john.farmer@agrilink.com',
    userType: 'farmer',
    location: 'Green Valley Farms',
    joinDate: 'January 15, 2023'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80');
  const [showPassword, setShowPassword] = useState(false);
  const [tempPassword, setTempPassword] = useState('');

  useEffect(() => {
    // Load user data from storage or API
    // For demo purposes, we're using static data
  }, []);

  const toggleEdit = () => {
    if (isEditing) {
      // Save changes logic would go here
      Alert.alert('Success', 'Profile updated successfully');
    }
    setIsEditing(!isEditing);
  };

  const changePassword = () => {
    Alert.alert('Change Password', 'Password change functionality would be implemented here');
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

        {isEditing && (
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password (leave blank to keep current)"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={tempPassword}
              onChangeText={setTempPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons 
                name={showPassword ? "eye-outline" : "eye-off-outline"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
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

        {!isEditing && (
          <TouchableOpacity 
            style={[styles.button, styles.passwordButton]}
            onPress={changePassword}
          >
            <Ionicons name="key-outline" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
        )}

        {isEditing && (
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={() => setIsEditing(false)}
          >
            <Ionicons name="close-circle" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="card-outline" size={22} color="#1B5E20" />
          <Text style={styles.menuText}>Payment Methods</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="document-text-outline" size={22} color="#1B5E20" />
          <Text style={styles.menuText}>Order History</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={22} color="#1B5E20" />
          <Text style={styles.menuText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="shield-checkmark-outline" size={22} color="#1B5E20" />
          <Text style={styles.menuText}>Privacy & Security</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
        
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
});