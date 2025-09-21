import { View, Text, StyleSheet, Button } from 'react-native';
import { Link, router } from 'expo-router';

export default function HomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AgriLink Home</Text>
      <Text style={styles.subtitle}>Welcome to your farming companion</Text>
      
      <Button 
        title="Go to Login" 
        onPress={() => router.push('/login')}
      />
      
      <Button 
        title="Go to Onboarding" 
        onPress={() => router.push('/onboarding')}
        style={{ marginTop: 10 }}
      />
      
      <Link href="/login" style={styles.link}>
        Login with Link
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  link: {
    color: 'blue',
    fontSize: 16,
    marginTop: 20,
  },
});