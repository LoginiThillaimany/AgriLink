// app/onboarding.js
import { View, Text, StyleSheet, Button } from 'react-native';
import { router } from 'expo-router';

export default function OnboardingPage() {
  const completeOnboarding = () => {
    // Save onboarding completion status
    // Then navigate to home or main app
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Onboarding</Text>
      <Text style={styles.text}>Welcome to AgriLink! Let's get started.</Text>
      
      <Button title="Complete Onboarding" onPress={completeOnboarding} />
      
      <Button 
        title="Skip" 
        onPress={() => router.back()}
        color="gray"
      />
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
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
});