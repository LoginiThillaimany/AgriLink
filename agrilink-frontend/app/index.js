import { View, Text, StyleSheet, Image } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function LogoPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/onboarding');
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/Logo.png')} // Adjust path if needed
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#133332', // Dark green background
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Updated style for the logo image to make it bigger
  logoImage: {
    width: 500, // Increased from 80 to 280
    height: 500, // Increased from 80 to 280
  },
});