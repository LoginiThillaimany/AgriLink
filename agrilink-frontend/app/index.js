import { View, Text, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function LogoPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/home_farmer');
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>AgriLink</Text>
        <Text style={styles.subtitle}>Connecting Farmers & Customers</Text>
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
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
});
