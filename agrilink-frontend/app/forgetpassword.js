// app/forgot-password.js
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { userEmailService } from '../services/userEmailService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // User input fields
  const [storedOtp, setStoredOtp] = useState(''); // Store OTP for verification
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP, 3: New password
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const otpInputs = useRef([]);

  // Reset form state
  const resetForm = () => {
    setEmail('');
    setOtp(['', '', '', '', '', '']);
    setStoredOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setStep(1);
  };

  // Ensure password fields are empty when component loads
  useEffect(() => {
    setNewPassword('');
    setConfirmPassword('');
  }, []);

  // Clear password fields when entering step 3
  useEffect(() => {
    if (step === 3) {
      setNewPassword('');
      setConfirmPassword('');
      // Force clear any browser autofill
      setTimeout(() => {
        setNewPassword('');
        setConfirmPassword('');
      }, 100);
    }
  }, [step]);

  const handleSendOTP = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Call backend API to generate and store OTP in MongoDB
      const response = await fetch('http://localhost:5000/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Check if user has email template for EmailJS
        const userTemplate = userEmailService.getUserTemplate(email);
        
        if (!userTemplate) {
          Alert.alert('Error', 'No account found with this email address. Please signup first.');
          return;
        }
        
        // Send OTP via EmailJS using the OTP from backend
        await userEmailService.sendOTPToUser(email, data.otp);
        
        // Store OTP for verification (but don't auto-fill input fields)
        setStoredOtp(data.otp);
        setStep(2);
        
        Alert.alert(
          'OTP Sent',
          `OTP has been sent to ${email}. Please check your email and enter the code manually.`,
          [{ text: 'OK', onPress: () => {} }]
        );
      } else {
        Alert.alert('Error', data.message || 'Failed to send OTP');
      }
      
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus to next input
    if (value && index < 5) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handleVerifyOTP = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit code');
      return;
    }
    
    // Verify OTP against stored OTP
    if (enteredOtp === storedOtp) {
      setIsLoading(true);
      // Clear password fields for new password entry
      setNewPassword('');
      setConfirmPassword('');
      // Clear any autofill values
      setTimeout(() => {
        setNewPassword('');
        setConfirmPassword('');
        setIsLoading(false);
        setStep(3);
      }, 1500);
    } else {
      Alert.alert('Error', 'Invalid OTP. Please check the code and try again.');
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password should be at least 6 characters long');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Call backend API to reset password
      const response = await fetch('http://localhost:5000/api/v1/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email, // Use email instead of phoneNumber
          otp: storedOtp, // Use stored OTP for verification
          newPassword: newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update AsyncStorage with new password
        await AsyncStorage.setItem('userPassword', newPassword);
        
        Alert.alert('Success', 'Your password has been reset successfully');
        // Clear form and redirect to login
        resetForm();
        router.replace('/login');
      } else {
        Alert.alert('Error', data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      setIsLoading(true);
      
      // Call backend API to generate new OTP
      const response = await fetch('http://localhost:5000/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Send OTP via EmailJS using the OTP from backend
        await userEmailService.sendOTPToUser(email, data.otp);
        
        // Store new OTP for verification (but don't auto-fill input fields)
        setStoredOtp(data.otp);
        
        Alert.alert('Code Sent', `A new verification code has been sent to ${email}. Please check your email and enter the code manually.`);
      } else {
        Alert.alert('Error', data.message || 'Failed to resend OTP');
      }
      
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
      <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/Logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
        
        <Text style={styles.title}>Reset Password</Text>
        
        {step === 1 && (
          <>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you a code to reset your password
            </Text>
            
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
            
            <TouchableOpacity 
              style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
              onPress={handleSendOTP}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.primaryButtonText}>Sending Code...</Text>
              ) : (
                <Text style={styles.primaryButtonText}>Send Verification Code</Text>
              )}
            </TouchableOpacity>
          </>
        )}
        
        {step === 2 && (
          <>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to {email}
            </Text>
            
            <View style={styles.otpContainer}>
              <View style={styles.otpInputsContainer}>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <TextInput
                    key={index}
                    ref={ref => otpInputs.current[index] = ref}
                    style={styles.otpInput}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={otp[index]}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={(e) => handleOtpKeyPress(e, index)}
                    selectTextOnFocus
                  />
                ))}
              </View>
              
              <TouchableOpacity onPress={resendOTP} disabled={isLoading}>
                <Text style={styles.resendText}>
                  Didn't receive the code? <Text style={styles.resendLink}>Resend</Text>
                </Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
              onPress={handleVerifyOTP}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.primaryButtonText}>Verifying...</Text>
              ) : (
                <Text style={styles.primaryButtonText}>Verify Code</Text>
              )}
            </TouchableOpacity>
          </>
        )}
        
        {step === 3 && (
          <>
            <Text style={styles.subtitle}>
              Create your new password
            </Text>
            
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor="#999"
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
                autoComplete="new-password"
                autoCorrect={false}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
                <Ionicons 
                  name={showNewPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                placeholderTextColor="#999"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoComplete="new-password"
                autoCorrect={false}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                <Ionicons 
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.primaryButtonText}>Resetting Password...</Text>
              ) : (
                <Text style={styles.primaryButtonText}>Reset Password</Text>
              )}
            </TouchableOpacity>
          </>
        )}
        
        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => {
            if (step > 1) {
              // Clear password fields when going back
              setNewPassword('');
              setConfirmPassword('');
              setStep(step - 1);
            } else {
              router.push('/login');
            }
          }}
        >
          <Ionicons name="arrow-back" size={16} color="#1B5E20" />
          <Text style={styles.secondaryButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

   logoContainer: {
    alignItems: 'center', // This centers the logo horizontally
    marginBottom: 30,
  },
  logoImage: {
    width: 500,
    height: 150,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B5E20',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 20,
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
  otpContainer: {
    marginBottom: 30,
  },
  otpInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#f9f9f9',
  },
  resendText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  resendLink: {
    color: '#1B5E20',
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: '#1B5E20',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#81C784',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  secondaryButtonText: {
    color: '#1B5E20',
    fontSize: 16,
    marginLeft: 5,
  },
});