import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!loading && !user) {
      navigation.replace('Login');
      return;
    }

    if (!loading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      if (user.role === 'Customer') {
        navigation.replace('CustomerDashboard');
      } else {
        navigation.replace('FarmerDashboard');
      }
    }
  }, [user, loading, allowedRoles, navigation]);

  if (loading) {
    return null; // Or a loading spinner
  }

  return children;
};

export default ProtectedRoute;