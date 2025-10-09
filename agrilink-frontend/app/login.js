import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login, register, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('login');

  const handleLogin = async () => {
    try {
      setError('');
      setIsLoading(true);
      await login(email, password);
      router.replace("/products");
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setError('');
      setIsLoading(true);
      await register(name, email, password);
      router.replace("/products");
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const currentMode = mode === 'login';

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }}
        style={styles.logo}
      />

      <Text style={styles.title}>{currentMode ? 'Welcome Back' : 'Create Account'}</Text>
      <Text style={styles.subtitle}>
        {currentMode ? 'Sign in to your AgriLink account' : 'Join the AgriLink community'}
      </Text>

      {!!error && <Text style={styles.error}>{error}</Text>}

      {!currentMode && (
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>
      )}

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#999"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.loginButton, (isLoading || loading) && styles.loginButtonDisabled]}
        onPress={currentMode ? handleLogin : handleRegister}
        disabled={isLoading || loading}
      >
        <Text style={styles.loginButtonText}>
          {isLoading || loading ? 'Please wait...' : (currentMode ? 'Login' : 'Create Account')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/forgetpassword')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>
          {currentMode ? "Don't have an account? " : 'Already have an account? '}
        </Text>
        <TouchableOpacity onPress={() => setMode(currentMode ? 'register' : 'login')}>
          <Text style={styles.signupLink}>
            {currentMode ? 'Sign Up' : 'Sign In'}
          </Text>
        </TouchableOpacity>
      </View>
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
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 30,
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
  error: {
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
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
  eyeIcon: {
    padding: 5,
  },
  loginButton: {
    backgroundColor: '#1B5E20',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonDisabled: {
    backgroundColor: '#81C784',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#1B5E20',
    textAlign: 'center',
    marginBottom: 30,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#666',
  },
  signupLink: {
    color: '#1B5E20',
    fontWeight: 'bold',
  },
});
