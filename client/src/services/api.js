// client/src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api',
});

// Attach token if present
API.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('quizAppUser');
  if (storedUser) {
    const { token } = JSON.parse(storedUser);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default API;