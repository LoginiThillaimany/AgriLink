import React, { useState, useRef, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  View,
  Text,
  Alert,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Animated,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import colors from '../styles/colors';
import shadows from '../styles/shadows';

const { width, height } = Dimensions.get("window");

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Customer");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        await login(data);
        toast.success("Login successful! Welcome back! 🎉");
        if (data.role === "Farmer") {
          navigation.navigate("AddProduct");
        } else {
          navigation.navigate("Home");
        }
      } else {
        Alert.alert("Login Failed", data.error || "Please check your credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Network Error", "Please check your internet connection");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    Alert.alert("Coming Soon", `${provider} login will be available soon!`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50] }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary[700]} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with Gradient */}
          <LinearGradient
            colors={['#064e3b', '#047857', '#10b981']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingTop: 40,
              paddingBottom: 60,
              borderBottomLeftRadius: 30,
              borderBottomRightRadius: 30,
              alignItems: 'center',
            }}
          >
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                alignItems: 'center',
              }}
            >
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: 20,
                borderRadius: 30,
                marginBottom: 20,
              }}>
                <Ionicons name="leaf" size={40} color="white" />
              </View>
              
              <Text style={{
                fontSize: 32,
                fontWeight: '900',
                color: 'white',
                marginBottom: 8,
                textAlign: 'center',
              }}>
                Welcome Back
              </Text>
              
              <Text style={{
                fontSize: 16,
                color: 'rgba(255, 255, 255, 0.9)',
                textAlign: 'center',
                fontWeight: '500',
              }}>
                Sign in to your AgriLink account
              </Text>
            </Animated.View>
          </LinearGradient>

          {/* Login Form */}
          <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 40 }}>
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              }}
            >
              <Card variant="elevated" style={{ padding: 24, marginBottom: 24 }}>
                <Text style={{
                  fontSize: 24,
                  fontWeight: '800',
                  color: colors.neutral[800],
                  marginBottom: 8,
                  textAlign: 'center',
                }}>
                  Sign In
                </Text>
                
                <Text style={{
                  fontSize: 14,
                  color: colors.neutral[600],
                  textAlign: 'center',
                  marginBottom: 32,
                }}>
                  Enter your credentials to continue
                </Text>

                <Input
                  label="Email Address"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  leftIcon="mail-outline"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                />

                <Input
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  leftIcon="lock-closed-outline"
                  secureTextEntry
                  error={errors.password}
                />

                {/* Role Selection */}
                <View style={{ marginBottom: 16 }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.neutral[700],
                    marginBottom: 8,
                  }}>
                    Select Role
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Button
                      title="Customer"
                      variant={role === "Customer" ? "gradient" : "outline"}
                      onPress={() => setRole("Customer")}
                      style={{ flex: 1, marginRight: 8 }}
                    />
                    <Button
                      title="Farmer"
                      variant={role === "Farmer" ? "gradient" : "outline"}
                      onPress={() => setRole("Farmer")}
                      style={{ flex: 1, marginLeft: 8 }}
                    />
                  </View>
                </View>

                <Button
                  title="Sign In"
                  variant="gradient"
                  size="lg"
                  onPress={handleLogin}
                  loading={loading}
                  fullWidth
                  style={{ marginTop: 8, marginBottom: 16 }}
                />

                <Text style={{
                  textAlign: 'center',
                  color: colors.neutral[500],
                  fontSize: 14,
                  marginVertical: 20,
                }}>
                  or continue with
                </Text>

                {/* Social Login Buttons */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
                  <Button
                    title="Google"
                    variant="outline"
                    icon="logo-google"
                    onPress={() => handleSocialLogin("Google")}
                    style={{ flex: 1, marginRight: 8 }}
                  />
                  <Button
                    title="Facebook"
                    variant="outline"
                    icon="logo-facebook"
                    onPress={() => handleSocialLogin("Facebook")}
                    style={{ flex: 1, marginLeft: 8 }}
                  />
                </View>
              </Card>

              {/* Sign Up Link */}
              <Card variant="glass" style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{
                  color: colors.neutral[600],
                  fontSize: 14,
                  marginBottom: 8,
                }}>
                  Don't have an account?
                </Text>
                <Button
                  title="Create Account"
                  variant="ghost"
                  onPress={() => navigation.navigate("Register")}
                  icon="person-add-outline"
                />
              </Card>

              {/* Footer */}
              <View style={{ alignItems: 'center', marginTop: 40, marginBottom: 20 }}>
                <Text style={{
                  color: colors.neutral[400],
                  fontSize: 12,
                  textAlign: 'center',
                }}>
                  By signing in, you agree to our Terms of Service{'\n'}
                  and Privacy Policy
                </Text>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;