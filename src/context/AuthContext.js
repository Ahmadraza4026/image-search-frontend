// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Attach refresh token flow to apiClient
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    try {
      const res = await apiClient.post('/auth/refresh-token', { refreshToken });
      const newAccessToken = res.data.accessToken;
      localStorage.setItem('token', newAccessToken);
      return newAccessToken;
    } catch (err) {
      console.error('Token refresh failed:', err);
      logout();
      return null;
    }
  };

  // Add token refresh logic to axios interceptor
  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          const newToken = await refreshAccessToken();
          if (newToken) {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => apiClient.interceptors.response.eject(interceptor);
  }, []);

  // Load user on first mount if accessToken exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      apiClient.get('/users/me')
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Accept access + refresh tokens at login
  const login = async (accessToken, refreshToken) => {
    setLoading(true);
    try {
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      const res = await apiClient.get('/users/me');
      setUser(res.data);
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      logout();
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
