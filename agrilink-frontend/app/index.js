import { View, Text, StyleSheet, Image, Platform } from 'react-native';
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
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>A</Text>
        </View>
        <Text style={styles.title}>AgriLink</Text>
      </View>
      <Text style={styles.subtitle}>Your farming companion</Text>
      
      <View style={styles.loadingContainer}>
        <View style={styles.loadingBar}>
          <View style={styles.progressBar} />
        </View>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B5E20', // Dark green background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    ...(Platform.OS === 'web' ? { boxShadow: '0 4px 10px rgba(0,0,0,0.12)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    }),
  },
  logoText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#1B5E20', // Dark green color
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    ...(Platform.OS === 'web' ? { } : {
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    }),
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 40,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  loadingBar: {
    width: 200,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 10,
    fontSize: 14,
  },
});