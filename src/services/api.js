import axios from 'axios';
import { django_api_url } from './BackendConfig';

import {
  AUTH_LOGIN,
  AUTH_REGISTER,
  AUTH_REFRESH,
} from './apiRoutes';


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


// Process requests waiting for a refreshed access token
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};


// ============================================================
// 1. REQUEST INTERCEPTOR
// ============================================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    const isAuthRoute =
      config.url?.includes(AUTH_LOGIN) ||
      config.url?.includes(AUTH_REGISTER);

    if (token && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);


// ============================================================
// 2. RESPONSE INTERCEPTOR
// ============================================================

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Safety check
    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isLoginRequest =
      originalRequest.url?.includes(AUTH_LOGIN);

    const isRefreshRequest =
      originalRequest.url?.includes(AUTH_REFRESH);


    // --------------------------------------------------------
    // Handle expired access token
    // --------------------------------------------------------

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isLoginRequest &&
      !isRefreshRequest
    ) {

      const refreshToken =
        localStorage.getItem('refresh_token');


      // ------------------------------------------------------
      // No refresh token = guest / logged-out user
      // ------------------------------------------------------

      if (!refreshToken) {
        return Promise.reject(error);
      }


      // ------------------------------------------------------
      // Another request is already refreshing the token
      // ------------------------------------------------------

      if (isRefreshing) {

        return new Promise((resolve, reject) => {

          failedQueue.push({
            resolve,
            reject,
          });

        })
          .then((token) => {

            originalRequest.headers.Authorization =
              `Bearer ${token}`;

            return api(originalRequest);

          })
          .catch((err) => {

            return Promise.reject(err);

          });
      }


      // ------------------------------------------------------
      // Start token refresh
      // ------------------------------------------------------

      originalRequest._retry = true;
      isRefreshing = true;


      try {

        const response = await axios.post(
          `${API_BASE_URL}${AUTH_REFRESH}`,
          {
            refresh: refreshToken,
          }
        );


        const newAccessToken =
          response.data.access;


        // Save new access token
        localStorage.setItem(
          'access_token',
          newAccessToken
        );


        // Tell queued requests that the token is ready
        processQueue(
          null,
          newAccessToken
        );


        // Retry the original request
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;


        return api(originalRequest);

      } catch (refreshError) {

        // Refresh failed
        processQueue(
          refreshError,
          null
        );


        // Clear authentication data
        localStorage.removeItem(
          'access_token'
        );

        localStorage.removeItem(
          'refresh_token'
        );

        localStorage.removeItem(
          'user_info'
        );

        localStorage.removeItem(
          'id'
        );


        // Notify the application
        window.dispatchEvent(
          new Event('session-expired')
        );


        return Promise.reject(
          refreshError
        );

      } finally {

        isRefreshing = false;
      }
    }


    // --------------------------------------------------------
    // Everything else
    // --------------------------------------------------------

    return Promise.reject(error);
  }
);


export default api;



















