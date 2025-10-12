import axios from 'axios';
import { Platform } from 'react-native';

// API Configuration
const getBaseURL = () => {
  // Allow overriding via Expo public env var for physical devices
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv && typeof fromEnv === 'string' && fromEnv.trim().length > 0) {
    let env = fromEnv.trim().replace(/\/$/, '');
    // Handle malformed values like ":5000" → "http://localhost:5000"
    if (env.startsWith(':')) {
      return `http://localhost${env}`;
    }
    // If protocol missing, prefix with http://
    if (!/^https?:\/\//i.test(env)) {
      env = `http://${env}`;
    }
    return env;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000'; // Android emulator
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:5000'; // iOS simulator
  }
  return 'http://localhost:5000'; // Web
};

export const API_BASE_URL = getBaseURL();
export const PRODUCTS_URL = `${API_BASE_URL}/api/v1/products`;

// Auth token management
let authToken = null;

export function setAuthToken(token) {
  authToken = token || null;
}

// Create axios instance
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get('/products', { params });
      // Normalize response format
      return {
        success: true,
        data: response.data || response,
        pagination: response.pagination || {
          hasNextPage: (response.data || response).length === (params.limit || 10),
          totalItems: (response.data || response).length
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return {
        success: true,
        data: response.data || response
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  create: async (data) => {
    try {
      const response = await apiClient.post('/products', data);
      return {
        success: true,
        data: response.data || response
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/products/${id}`, data);
      return {
        success: true,
        data: response.data || response
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/products/${id}`);
      return {
        success: true,
        data: response.data || response
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  toggleSoldOut: async (id) => {
    try {
      const response = await apiClient.patch(`/products/${id}/toggle-soldout`);
      return {
        success: true,
        data: response.data || response
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  getSalesAnalytics: async (params = {}) => {
    try {
      const response = await apiClient.get('/products/analytics/sales', { params });
      return {
        success: true,
        data: response.data || response
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// Alternative fetch-based API (from teammate's branch)
async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const url = `${API_BASE_URL}${path}`;
  const finalHeaders = { 'Content-Type': 'application/json', ...headers };
  if (authToken) {
    finalHeaders['Authorization'] = `Bearer ${authToken}`;
  }
  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }
  if (!res.ok) {
    const message = (data && data.error) || res.statusText;
    throw new Error(message);
  }
  return data;
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  del: (path) => request(path, { method: 'DELETE' }),
};

export default apiClient;
