import axios from 'axios';
import { Platform } from 'react-native';

// API Configuration
const getBaseURL = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000'; // Android emulator
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:5000'; // iOS simulator
  }
  return 'http://localhost:5000'; // Web
};

export const API_BASE_URL = getBaseURL();
export const PRODUCTS_URL = `${API_BASE_URL}/api/v1/products`;

// Create axios instance
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message ||
                        'Network error occurred';
    
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
    });
  }
);

// Product API functions
export const productAPI = {
  getAll: (params = {}) => apiClient.get('/products', { params }),
  getById: (id) => apiClient.get(`/products/${id}`),
  create: (data) => apiClient.post('/products', data),
  update: (id, data) => apiClient.put(`/products/${id}`, data),
  delete: (id) => apiClient.delete(`/products/${id}`),
  toggleSoldOut: (id) => apiClient.patch(`/products/${id}/toggle-soldout`),
  getSalesAnalytics: (params = {}) => apiClient.get('/products/analytics/sales', { params }),
};

export default apiClient;