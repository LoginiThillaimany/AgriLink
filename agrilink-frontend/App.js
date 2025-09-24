import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import AddProduct from './pages/AddProduct';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import ProductHistory from './pages/ProductHistory';
import Profile from './pages/Profile';
import FarmerDashboard from './pages/FarmerDashboard';
import CustomerDashboard from './pages/CustomerDashboard';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#10b981' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
        initialRouteName="Home"
      >
        <Stack.Screen name="Login" component={Login} options={{ title: 'Login' }} />
        <Stack.Screen name="Register" component={Register} options={{ title: 'Register' }} />
        <Stack.Screen name="Home" component={Home} options={{ title: 'AgriLink' }} />
        
        {/* Customer Routes */}
        <Stack.Screen
          name="CustomerDashboard"
          options={{ title: 'Customer Dashboard' }}
        >
          {(props) => (
            <ProtectedRoute allowedRoles={['Customer']}>
              <CustomerDashboard {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>
        
        <Stack.Screen
          name="ProductList"
          options={{ title: 'Products' }}
        >
          {(props) => (
            <ProtectedRoute allowedRoles={['Customer', 'Farmer']}>
              <ProductList {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        <Stack.Screen
          name="ProductDetail"
          options={{ title: 'Product Detail' }}
        >
          {(props) => (
            <ProtectedRoute allowedRoles={['Customer']}>
              <ProductDetail {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Cart"
          options={{ title: 'Shopping Cart' }}
        >
          {(props) => (
            <ProtectedRoute allowedRoles={['Customer']}>
              <Cart {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Checkout"
          options={{ title: 'Checkout' }}
        >
          {(props) => (
            <ProtectedRoute allowedRoles={['Customer']}>
              <Checkout {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        <Stack.Screen
          name="OrderHistory"
          options={{ title: 'Order History' }}
        >
          {(props) => (
            <ProtectedRoute allowedRoles={['Customer']}>
              <OrderHistory {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        {/* Farmer Routes */}
        <Stack.Screen
          name="FarmerDashboard"
          options={{ title: 'Farmer Dashboard' }}
        >
          {(props) => (
            <ProtectedRoute allowedRoles={['Farmer']}>
              <FarmerDashboard {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        <Stack.Screen
          name="AddProduct"
          options={{ title: 'Add Product' }}
        >
          {(props) => (
            <ProtectedRoute allowedRoles={['Farmer']}>
              <AddProduct {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        <Stack.Screen
          name="ProductHistory"
          options={{ title: 'My Products' }}
        >
          {(props) => (
            <ProtectedRoute allowedRoles={['Farmer']}>
              <ProductHistory {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        {/* Shared Routes */}
        <Stack.Screen
          name="Profile"
          options={{ title: 'Profile' }}
        >
          {(props) => (
            <ProtectedRoute allowedRoles={['Customer', 'Farmer']}>
              <Profile {...props} />
            </ProtectedRoute>
          )}
        </Stack.Screen>
        </Stack.Navigator>
        <StatusBar style="light" />
        <Toaster />
      </NavigationContainer>
    </AuthProvider>
  );
}
