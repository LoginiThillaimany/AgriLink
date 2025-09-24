import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
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
  );
}
