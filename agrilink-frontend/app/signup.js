// app/signup.js
<<<<<<< HEAD
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
=======
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { userEmailService } from '../services/userEmailService';

>>>>>>> origin/thirishnaviP

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('farmer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

<<<<<<< HEAD
  const handleSignup = () => {
    setIsLoading(true);
    // Your signup logic here
    console.log('Signup attempted with:', { fullName, phoneNumber, email, userType });
    
    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false);
      // After successful signup, navigate to home
      router.replace('/');
    }, 1500);
=======
  const handleSignup = async () => {
    if (!fullName || !phoneNumber || !email || !password) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phoneNumber, email, password, userType }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Signup successful', data);
        
        // Create email template for the new user
        try {
          await userEmailService.createUserTemplate({
            email: email,
            fullName: fullName
          });
          console.log(`✅ Email template created for ${email}`);
        } catch (emailError) {
          console.warn('Email template creation failed:', emailError);
          // Don't fail signup if email template creation fails
        }
        
        // Store user data for profile page
        await AsyncStorage.setItem('userData', JSON.stringify(data.data.user));
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('userPassword', password); // Store the password
        router.replace('/login');
      } else {
        Alert.alert('Signup failed', data.message || 'Please try again');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
>>>>>>> origin/thirishnaviP
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
<<<<<<< HEAD
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }}
          style={styles.logo}
        />
        
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join the AgriLink community</Text>
=======
        {/* Logo Container to center the logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/Logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join the AgriiLink community</Text>
>>>>>>> origin/thirishnaviP
        
        <View style={styles.userTypeContainer}>
          <Text style={styles.userTypeLabel}>I am a:</Text>
          <View style={styles.userTypeButtons}>
            <TouchableOpacity 
              style={[styles.userTypeButton, userType === 'farmer' && styles.userTypeButtonActive]}
              onPress={() => setUserType('farmer')}
            >
              <Text style={[styles.userTypeButtonText, userType === 'farmer' && styles.userTypeButtonTextActive]}>
                Farmer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.userTypeButton, userType === 'consumer' && styles.userTypeButtonActive]}
              onPress={() => setUserType('consumer')}
            >
              <Text style={[styles.userTypeButtonText, userType === 'consumer' && styles.userTypeButtonTextActive]}>
                Consumer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#999"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            <Ionicons 
              name={showPassword ? "eye-outline" : "eye-off-outline"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>
            <Ionicons 
              name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
          onPress={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? (
            <Text style={styles.signupButtonText}>Creating Account...</Text>
          ) : (
            <Text style={styles.signupButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
<<<<<<< HEAD
        
       
=======
>>>>>>> origin/thirishnaviP
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingVertical: 40,
  },
<<<<<<< HEAD
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
=======
  logoContainer: {
    alignItems: 'center', // Centers the logo horizontally
    marginBottom: 20,
  },
  logoImage: {
    width: 500, // Adjusted to a more reasonable size
    height: 150, // Adjusted to a more reasonable size
  },
>>>>>>> origin/thirishnaviP
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B5E20',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  userTypeContainer: {
    marginBottom: 20,
  },
  userTypeLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    fontWeight: '500',
  },
  userTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userTypeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  userTypeButtonActive: {
    backgroundColor: '#1B5E20',
  },
  userTypeButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  userTypeButtonTextActive: {
    color: 'white',
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
  eyeIcon: {
    padding: 5,
  },
  signupButton: {
    backgroundColor: '#1B5E20',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  signupButtonDisabled: {
    backgroundColor: '#81C784',
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: '#666',
  },
  loginLink: {
    color: '#1B5E20',
    fontWeight: 'bold',
  },
<<<<<<< HEAD
  termsText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 10,
  },
  termsLink: {
    color: '#1B5E20',
  },
=======
>>>>>>> origin/thirishnaviP
});