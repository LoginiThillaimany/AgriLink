import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DashboardScreen = ({ userType }) => {
  if (userType !== 'buyer' && userType !== 'farmer') {
    return <Text style={styles.message}>Access denied!</Text>;
  }
  return <Text style={styles.message}>Dashboard (Under Construction)</Text>;
};

const styles = StyleSheet.create({
  message: { textAlign: 'center', fontSize: 18, color: '#FF9800', padding: 20 },
});

export default DashboardScreen;