import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('formSaathi_token') || '');
  const [loading, setLoading] = useState(true);

  // Set default auth header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('formSaathi_token', token);
      localStorage.setItem('formSaathi_auth', 'true');
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('formSaathi_token');
      localStorage.removeItem('formSaathi_auth');
    }
  }, [token]);

  // Check auth state on initial mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken = localStorage.getItem('formSaathi_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        });
        setUser(response.data);
      } catch (err) {
        console.warn('Session expired or invalid token:', err?.response?.data?.detail || err.message);
        // Clear invalid session
        setToken('');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: email.trim(),
        password: password
      });

      const { access_token, user: userData } = response.data;
      setToken(access_token);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Login failed. Please check your credentials or connection.';
      return { success: false, error: errorMsg };
    }
  };

  const register = async (fullName, email, password, confirmPassword) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        full_name: fullName.trim(),
        email: email.trim(),
        password: password,
        confirm_password: confirmPassword
      });

      const { access_token, user: userData } = response.data;
      setToken(access_token);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Registration failed. Please try again.';
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post(`${API_BASE_URL}/auth/logout`);
      }
    } catch (e) {
      // Ignore logout errors
    } finally {
      setToken('');
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
