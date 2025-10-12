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
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="signup" />
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="forgetpassword" />
              <Stack.Screen name="useraccount" />
              <Stack.Screen name="home" />
              <Stack.Screen name="homefarmer" />
              <Stack.Screen name="paymentsuccess" />
              <Stack.Screen name="paymentmethod" />
              <Stack.Screen name="addproduct"/>

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
