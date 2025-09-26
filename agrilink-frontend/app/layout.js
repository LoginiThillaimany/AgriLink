import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'AgriLink',
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="home_farmer" 
          options={{ 
            title: 'Farmer Home',
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="home_customer" 
          options={{ 
            title: 'Customer Home',
            headerShown: false
          }} 
        />
      </Stack>
    </View>
  );
}
