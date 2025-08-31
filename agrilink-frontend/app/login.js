// app/login.js
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { router } from 'expo-router';

export default function LoginPage() {
  const handleLogin = () => {
    // Your login logic here
    console.log('Login attempted');
    // After successful login, navigate to home or other page
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
      />
      
      <Button title="Login" onPress={handleLogin} />
      
      <Button 
        title="Back to Home" 
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
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});