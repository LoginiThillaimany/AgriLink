import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import AddProduct from './pages/AddProduct';
import Cart from './pages/Cart';
import OrderHistory from './pages/OrderHistory';
import ProductHistory from './pages/ProductHistory';
import Profile from './pages/Profile';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#10b981' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
        initialRouteName="Home"
      >
        <Stack.Screen name="Home" component={Home} options={{ title: 'AgriLink' }} />
        <Stack.Screen name="ProductList" component={ProductList} options={{ title: 'Products' }} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ title: 'Product Detail' }} />
        <Stack.Screen name="AddProduct" component={AddProduct} options={{ title: 'Add Product' }} />
        <Stack.Screen name="Cart" component={Cart} options={{ title: 'Shopping Cart' }} />
        <Stack.Screen name="OrderHistory" component={OrderHistory} options={{ title: 'Order History' }} />
        <Stack.Screen name="ProductHistory" component={ProductHistory} options={{ title: 'Product History' }} />
        <Stack.Screen name="Profile" component={Profile} options={{ title: 'Profile' }} />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
