<<<<<<< HEAD
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform, View } from "react-native";
import { CartProvider } from '@/context/CartContext';
import { ProductsProvider } from '@/context/ProductsContext';
import { AuthProvider } from '@/context/AuthContext';

let Toaster = null;
if (Platform.OS === "web") {
  try {
    // eslint-disable-next-line global-require
    Toaster = require("react-hot-toast").Toaster;
  } catch (e) {
    Toaster = null;
  }
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <SafeAreaView style={{ flex: 1 }}>
            {Toaster ? (
              <View style={{ position: "absolute", zIndex: 9999 }}>
                <Toaster position="top-right" />
              </View>
            ) : null}
            <Stack screenOptions={{ headerShown: false }}>
              {/* Public routes */}
              <Stack.Screen name="login" />
              <Stack.Screen name="signup" />
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="forgetpassword" />

              {/* Dashboard (bottom tabs) */}
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

              {/* Products stack (nested inside dashboard) */}
              <Stack.Screen name="products" options={{ headerShown: false }} />
            </Stack>
          </SafeAreaView>
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}
=======
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'AgriLink',
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="login" 
          options={{ 
            title: 'Login',
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="onboarding" 
          options={{ 
            title: 'Onboarding',
            presentation: 'modal'
          }} 
        />

         <Stack.Screen 
          name="signup" 
          options={{ 
            title: 'Sign Up',
            presentation: 'modal'
          }} 
        />

         <Stack.Screen 
          name="forgetpassword" 
          options={{ 
            title: 'Forget Password',
            presentation: 'modal'
          }} 
        />

          <Stack.Screen 
          name="useraccount" 
          options={{ 
            title: 'User Account',
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="home" 
          options={{ 
            title: 'Home',
            headerShown: false
          }} 
        />
          <Stack.Screen 
          name="homefarmer" 
          options={{ 
            title: 'homefarmer',
            headerShown: false
          }} 
        />
         <Stack.Screen 
          name="paymentsuccess" 
          options={{ 
            title: 'paymentsuccess',
            headerShown: false
          }} 
        />

         <Stack.Screen 
          name="paymentmethod" 
          options={{ 
            title: 'paymentmethod',
            headerShown: false
          }} 
        />
        
      </Stack>
    </SafeAreaView>
  );
}
>>>>>>> origin/thirishnaviP
