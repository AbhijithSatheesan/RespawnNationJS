import axios from 'axios';
import { django_api_url } from './BackendConfig';

const API_BASE_URL = django_api_url;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Request Interceptor: Attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    
    // We don't need to send the token if they are actively trying to log in or register
    const isAuthRoute = config.url.includes('accounts/login/') || config.url.includes('accounts/register/');
    
    if (token && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Silent Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // CRITICAL FIX: Do NOT try to refresh if the 401 came from the login page or the refresh endpoint itself!
    const isLoginRequest = originalRequest.url.includes('accounts/login/');
    const isRefreshRequest = originalRequest.url.includes('auth/jwt/refresh/');

    if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest && !isRefreshRequest) {
      originalRequest._retry = true; 

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error("No refresh token found");

        // Request new token
        // Make sure this URL exactly matches your Django JWT refresh route!
        const response = await axios.post(`${API_BASE_URL}/auth/jwt/refresh/`, {
          refresh: refreshToken,
        });

        // Save new token
        const newAccessToken = response.data.access;
        localStorage.setItem('access_token', newAccessToken);

        // Update headers and retry
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        console.error('Session expired. Redirecting to login.');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        // Use window.location to force a hard redirect and clear React state
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;