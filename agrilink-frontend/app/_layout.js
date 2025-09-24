import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform, View } from "react-native";

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
  );
}
