import axios from 'axios';
import { django_api_url } from './BackendConfig';

// The base url for django api backend
const API_BASE_URL = django_api_url 

// 2. Create the Axios Instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. The Interceptor (The "Security Guard")
// Before every request, check if a token exists and attach it.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;