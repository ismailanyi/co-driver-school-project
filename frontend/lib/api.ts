import axios from 'axios';
import { router } from 'expo-router';

// Shared Axios instance — use this instead of creating axios.create() everywhere.
// It automatically:
//   1. Sets the base URL from the environment variable
//   2. Attaches the Bearer token to every request
//   3. Signs the user out if the server returns 401 (token expired/invalid)
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// Before each request: attach the token
api.interceptors.request.use(async (config) => {
  const { useAuthStore } = require('@/store/useAuthStore');
  let token = useAuthStore.getState().token;
  // If token isn't in memory yet (e.g., app just launched), load from storage
  if (!token) {
    token = await useAuthStore.getState().getToken();
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// After each response: if 401, sign out and redirect to signin
api.interceptors.response.use(
  (response) => response,   // success — pass through
  (error) => {
    // Only redirect if it's a 401 and NOT from the signin endpoint itself
    const isSignInRoute = error.config?.url === '/auth/signin';
    if (error.response?.status === 401 && !isSignInRoute) {
      const { useAuthStore } = require('@/store/useAuthStore');
      // Token is expired or invalid — clear everything and go to login
      useAuthStore.getState().setToken(null);
      useAuthStore.getState().setUser(null);
      router.replace('/signin');
    }
    return Promise.reject(error);  // still throw so callers can handle other errors
  }
);

export default api;
