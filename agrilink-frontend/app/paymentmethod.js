// app/payment-method.js
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function PaymentMethodPage() {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('card');

  const handleAddPayment = async () => {
    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      Alert.alert('Error', 'Please fill all card details');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length !== 16) {
      Alert.alert('Error', 'Please enter a valid 16-digit card number');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push('/paymentsuccess');
    }, 2000);
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 3) {
      const formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
      setExpiryDate(formatted);
    } else {
      setExpiryDate(cleaned);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/Logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
      
      <Text style={styles.title}>Payment Method</Text>
      <Text style={styles.subtitle}>Add your payment details securely</Text>

      {/* Payment Method Selection */}
      <View style={styles.methodContainer}>
        <TouchableOpacity 
          style={[
            styles.methodButton,
            selectedMethod === 'card' && styles.methodButtonSelected
          ]}
          onPress={() => setSelectedMethod('card')}
        >
          <Ionicons 
            name="card-outline" 
            size={24} 
            color={selectedMethod === 'card' ? '#1B5E20' : '#666'} 
          />
          <Text style={[
            styles.methodText,
            selectedMethod === 'card' && styles.methodTextSelected
          ]}>
            Credit/Debit Card
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.methodButton,
            selectedMethod === 'mobile' && styles.methodButtonSelected
          ]}
          onPress={() => setSelectedMethod('mobile')}
        >
          <Ionicons 
            name="phone-portrait-outline" 
            size={24} 
            color={selectedMethod === 'mobile' ? '#1B5E20' : '#666'} 
          />
          <Text style={[
            styles.methodText,
            selectedMethod === 'mobile' && styles.methodTextSelected
          ]}>
            Mobile Money
          </Text>
        </TouchableOpacity>
      </View>

      {selectedMethod === 'card' ? (
        <>
          {/* Card Number */}
          <View style={styles.inputContainer}>
            <Ionicons name="card-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={formatCardNumber}
              maxLength={19}
            />
          </View>

          {/* Card Holder Name */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Card Holder Name"
              placeholderTextColor="#999"
              value={cardHolder}
              onChangeText={setCardHolder}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.rowContainer}>
            {/* Expiry Date */}
            <View style={[styles.inputContainer, styles.halfInput]}>
              <Ionicons name="calendar-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={expiryDate}
                onChangeText={formatExpiryDate}
                maxLength={5}
              />
            </View>

            {/* CVV */}
            <View style={[styles.inputContainer, styles.halfInput]}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="CVV"
                placeholderTextColor="#999"
                keyboardType="numeric"
                secureTextEntry
                value={cvv}
                onChangeText={setCvv}
                maxLength={3}
              />
            </View>
          </View>
        </>
      ) : (
        /* Mobile Money Section */
        <View style={styles.mobileSection}>
          <Text style={styles.mobileInfo}>
            Mobile Money payment options will be available soon. Please use card payment for now.
          </Text>
        </View>
      )}

      <TouchableOpacity 
        style={[styles.paymentButton, isLoading && styles.paymentButtonDisabled]}
        onPress={handleAddPayment}
        disabled={isLoading}
      >
        {isLoading ? (
          <Text style={styles.paymentButtonText}>Processing...</Text>
        ) : (
          <Text style={styles.paymentButtonText}>Add Payment Method</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>Back to Previous</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoImage: {
    width: 500,
    height: 150,
  },
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
    marginBottom: 40,
  },
  methodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
  },
  methodButtonSelected: {
    borderColor: '#1B5E20',
    backgroundColor: '#E8F5E8',
  },
  methodText: {
    marginLeft: 8,
    color: '#666',
    fontWeight: '500',
  },
  methodTextSelected: {
    color: '#1B5E20',
    fontWeight: 'bold',
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
  mobileSection: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  mobileInfo: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  paymentButton: {
    backgroundColor: '#1B5E20',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  paymentButtonDisabled: {
    backgroundColor: '#81C784',
  },
  paymentButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1B5E20',
  },
  backButtonText: {
    color: '#1B5E20',
    fontSize: 16,
    fontWeight: 'bold',
  },
});