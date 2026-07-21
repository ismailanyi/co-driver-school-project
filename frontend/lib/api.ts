import axios from 'axios';
import Constants from 'expo-constants';

const getApiUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl && !envUrl.includes('localhost')) {
    return envUrl;
  }
  
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:5000`;
  }
  
  return envUrl || 'http://localhost:5000';
};

const api = axios.create({
  baseURL: getApiUrl(),
});


api.interceptors.request.use(async (config) => {
  const { useAuthStore } = require('@/store/useAuthStore');
  let token = useAuthStore.getState().token;
  if (!token) {
    token = await useAuthStore.getState().getToken();
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isSignInRoute = error.config?.url === '/auth/signin';
    if (error.response?.status === 401 && !isSignInRoute) {
      const { useAuthStore } = require('@/store/useAuthStore');
      useAuthStore.getState().setToken(null);
      useAuthStore.getState().setUser(null);
    }
    return Promise.reject(error);
  }
);

export default api;
