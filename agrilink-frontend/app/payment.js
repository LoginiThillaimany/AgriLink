import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal
} from 'react-native';

const PaymentScreen = ({ route, navigation }) => {
  const { totalAmount, cartItems } = route.params;
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [upiId, setUpiId] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'upi', name: 'UPI Payment', icon: '📱' },
    { id: 'cod', name: 'Cash on Delivery', icon: '💰' },
  ];

  const handlePayment = async () => {
    if (paymentMethod === 'card') {
      if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
        Alert.alert('Error', 'Please fill all card details');
        return;
      }
      if (cardNumber.length !== 16) {
        Alert.alert('Error', 'Please enter valid card number');
        return;
      }
    }

    if (paymentMethod === 'upi' && !upiId) {
      Alert.alert('Error', 'Please enter UPI ID');
      return;
    }

    try {
      // Simulate payment processing
      const paymentData = {
        method: paymentMethod,
        amount: totalAmount,
        items: cartItems,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      // Call your backend payment API
      const response = await processPayment(paymentData);
      
      if (response.success) {
        setShowSuccessModal(true);
        // Navigate to order confirmation after 2 seconds
        setTimeout(() => {
          navigation.navigate('OrderConfirmation', {
            orderId: response.orderId,
            amount: totalAmount
          });
        }, 2000);
      }
    } catch (error) {
      Alert.alert('Payment Failed', 'Please try again');
    }
  };

  const processPayment = async (paymentData) => {
    // Replace with your actual backend API call
    const response = await fetch('http://localhost:5000/api/payments/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${yourAuthToken}`
      },
      body: JSON.stringify(paymentData)
    });
    
    return await response.json();
  };

  const formatCardNumber = (text) => {
    // Format as XXXX XXXX XXXX XXXX
    const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = cleaned.match(/\d{4,16}/g);
    const match = matches ? matches[0] : '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    return parts.length ? parts.join(' ') : cleaned;
  };

  const formatExpiryDate = (text) => {
    // Format as MM/YY
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 3) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Payment Method</Text>
      
      {/* Order Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Total Amount:</Text>
          <Text style={styles.summaryAmount}>₹{totalAmount}</Text>
        </View>
      </View>

      {/* Payment Methods */}
      <Text style={styles.sectionTitle}>Choose Payment Method</Text>
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.methodButton,
            paymentMethod === method.id && styles.methodButtonSelected
          ]}
          onPress={() => setPaymentMethod(method.id)}
        >
          <Text style={styles.methodIcon}>{method.icon}</Text>
          <Text style={styles.methodText}>{method.name}</Text>
          <View style={[
            styles.radioButton,
            paymentMethod === method.id && styles.radioButtonSelected
          ]}>
            {paymentMethod === method.id && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>
      ))}

      {/* Card Payment Form */}
      {paymentMethod === 'card' && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Card Details</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Card Number"
            value={cardNumber}
            onChangeText={(text) => setCardNumber(formatCardNumber(text))}
            keyboardType="numeric"
            maxLength={19}
          />
          
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="MM/YY"
              value={expiryDate}
              onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
              keyboardType="numeric"
              maxLength={5}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="CVV"
              value={cvv}
              onChangeText={setCvv}
              keyboardType="numeric"
              maxLength={3}
              secureTextEntry
            />
          </View>
          
          <TextInput
            style={styles.input}
            placeholder="Card Holder Name"
            value={cardHolder}
            onChangeText={setCardHolder}
          />
        </View>
      )}

      {/* UPI Payment Form */}
      {paymentMethod === 'upi' && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>UPI Details</Text>
          <TextInput
            style={styles.input}
            placeholder="UPI ID (e.g., name@upi)"
            value={upiId}
            onChangeText={setUpiId}
            keyboardType="email-address"
          />
          <Text style={styles.upiNote}>You will be redirected to your UPI app for payment</Text>
        </View>
      )}

      {/* COD Message */}
      {paymentMethod === 'cod' && (
        <View style={styles.codContainer}>
          <Text style={styles.codText}>
            💰 Pay cash when your order is delivered
          </Text>
          <Text style={styles.codNote}>
            Please keep exact change ready for the delivery person
          </Text>
        </View>
      )}

      {/* Pay Button */}
      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>
          {paymentMethod === 'cod' ? 'Confirm Order' : `Pay ₹${totalAmount}`}
        </Text>
      </TouchableOpacity>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successText}>
              Your payment of ₹{totalAmount} has been processed successfully.
            </Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2d5a27',
  },
  summaryContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryText: {
    fontSize: 16,
    color: '#666',
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d5a27',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  methodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  methodButtonSelected: {
    borderColor: '#2d5a27',
    borderWidth: 2,
  },
  methodIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  methodText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#2d5a27',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2d5a27',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  upiNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
  },
  codContainer: {
    backgroundColor: '#fff8e1',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  codText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ff6f00',
    marginBottom: 5,
  },
  codNote: {
    fontSize: 12,
    color: '#666',
  },
  payButton: {
    backgroundColor: '#2d5a27',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    margin: 20,
  },
  successIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2d5a27',
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});

export default PaymentScreen;