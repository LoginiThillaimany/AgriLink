import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FAB, Provider as PaperProvider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import ProductsScreen from '../screens/ProductsScreen';
import AddProductScreen from '../screens/AddProductScreen';
import DashboardScreen from '../screens/DashboardScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = ({ userType, userId }) => {
  const getInitialRoute = () => {
    if (userType === 'farmer') return 'Products';
    if (userType === 'buyer') return 'Dashboard';
    return 'Dashboard';
  };

  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName={getInitialRoute()}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              const icons = {
                Dashboard: 'dashboard',
                Products: 'store',
                Orders: 'shopping-cart',
                Profile: 'person',
              };
              return <MaterialIcons name={icons[route.name]} size={size} color={color} />;
            },
            tabBarStyle: { backgroundColor: '#FFF' },
          })}
        >
          <Tab.Screen name="Dashboard">
            {props => <DashboardScreen {...props} userType={userType} userId={userId} />}
          </Tab.Screen>
          <Tab.Screen name="Products">
            {props => <ProductsScreen {...props} userType={userType} userId={userId} />}
          </Tab.Screen>
          <Tab.Screen name="Orders">
            {props => <OrdersScreen {...props} userType={userType} userId={userId} />}
          </Tab.Screen>
          <Tab.Screen name="Profile">
            {props => <ProfileScreen {...props} userType={userType} userId={userId} />}
          </Tab.Screen>
          <Tab.Screen name="AddProduct" component={AddProductScreen} options={{ tabBarButton: () => null }} />
        </Tab.Navigator>
        {userType === 'farmer' && (
          <FAB
            icon="plus"
            style={{ position: 'absolute', bottom: 20, right: 20, backgroundColor: '#4CAF50' }}
            onPress={() => navigation.navigate('AddProduct', { userId, userType })}
            color="#FFF"
          />
        )}
      </NavigationContainer>
    </PaperProvider>
  );
};

export default AppNavigator;