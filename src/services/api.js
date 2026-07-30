import axios from 'axios';
import { django_api_url } from './BackendConfig';

const API_BASE_URL = django_api_url;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variables to handle multiple simultaneous requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 1. Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    const isAuthRoute = config.url.includes('accounts/login/') || config.url.includes('accounts/register/');
    
    if (token && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isLoginRequest = originalRequest.url.includes('accounts/login/');
    const isRefreshRequest = originalRequest.url.includes('auth/jwt/refresh/');

    if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest && !isRefreshRequest) {
      
      const refreshToken = localStorage.getItem('refresh_token');
      
      // FIX 1: If there is no refresh token, they are just a guest. 
      // Do NOT trigger the modal or redirect. Just reject the promise so the component handles it normally.
      if (!refreshToken) {
        return Promise.reject(error);
      }

      // FIX 2: If a refresh is already happening, put this request in a queue to wait
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/jwt/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        localStorage.setItem('access_token', newAccessToken);

        // Tell all queued requests that the new token is ready
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // The refresh token is dead. Tell all queued requests it failed.
        processQueue(refreshError, null);
        
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_info');
        localStorage.removeItem('id');
        
        // FIX 3: Instead of redirecting to /login, fire a global event
        window.dispatchEvent(new Event('session-expired'));
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

























// import axios from 'axios';
// import { django_api_url } from './BackendConfig';

// const API_BASE_URL = django_api_url;

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // 1. Request Interceptor: Attach token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('access_token');
    
//     // We don't need to send the token if they are actively trying to log in or register
//     const isAuthRoute = config.url.includes('accounts/login/') || config.url.includes('accounts/register/');
    
//     if (token && !isAuthRoute) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // 2. Response Interceptor: Silent Refresh
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // CRITICAL FIX: Do NOT try to refresh if the 401 came from the login page or the refresh endpoint itself!
//     const isLoginRequest = originalRequest.url.includes('accounts/login/');
//     const isRefreshRequest = originalRequest.url.includes('auth/jwt/refresh/');

//     if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest && !isRefreshRequest) {
//       originalRequest._retry = true; 

//       try {
//         const refreshToken = localStorage.getItem('refresh_token');
//         if (!refreshToken) throw new Error("No refresh token found");

//         // Request new token
//         // Make sure this URL exactly matches your Django JWT refresh route!
//         const response = await axios.post(`${API_BASE_URL}/auth/jwt/refresh/`, {
//           refresh: refreshToken,
//         });

//         // Save new token
//         const newAccessToken = response.data.access;
//         localStorage.setItem('access_token', newAccessToken);

//         // Update headers and retry
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return api(originalRequest);

//       } catch (refreshError) {
//         console.error('Session expired. Redirecting to login.');
//         localStorage.removeItem('access_token');
//         localStorage.removeItem('refresh_token');
        
//         // Use window.location to force a hard redirect and clear React state
//         window.location.href = '/login'; 
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;