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
      </Stack>
    </SafeAreaView>
  );
}