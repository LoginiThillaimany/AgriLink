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
      </Stack>
    </SafeAreaView>
  );
}