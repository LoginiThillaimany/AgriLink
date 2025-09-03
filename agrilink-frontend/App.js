import React from 'react';
import AppNavigator from './src/navigation/AppNavigator'; // Adjusted path

export default function App() {
  // For now, hardcode user type and ID (replace with auth logic later)
  const userType = 'farmer'; // Change to 'buyer' to test buyer view
  const userId = '123';     // Replace with real user ID from authentication

  // Quick check to avoid errors
  if (!userType || !userId) {
    console.error('Oops! userType or userId is missing!');
    return <Text style={{ textAlign: 'center', padding: 20 }}>Loading... (Check console)</Text>;
  }

  return <AppNavigator userType={userType} userId={userId} />;
}