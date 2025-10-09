import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setAuthToken } from '@/lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('auth');
        if (stored) {
          const { token: t, user: u } = JSON.parse(stored);
          setToken(t);
          setUser(u);
          setAuthToken(t);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveAuth = async (t, u) => {
    setToken(t);
    setUser(u);
    setAuthToken(t);
    await AsyncStorage.setItem('auth', JSON.stringify({ token: t, user: u }));
  };

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    await saveAuth(res.token, res.user);
  };

  const register = async (name, email, password) => {
    const res = await api.post('/api/auth/register', { name, email, password });
    await saveAuth(res.token, res.user);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    await AsyncStorage.removeItem('auth');
  };

  const value = useMemo(() => ({ user, token, loading, login, register, logout }), [user, token, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


