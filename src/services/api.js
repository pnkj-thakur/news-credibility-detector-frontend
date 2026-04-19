import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api',
  timeout: Number(process.env.REACT_APP_API_TIMEOUT || 30000),
});

export function signup(payload) {
  return api.post('/auth/signup', payload);
}

export function login(payload) {
  return api.post('/auth/login', payload);
}

export function healthCheck() {
  return api.get('/health');
}

export function getArticles(userId) {
  return api.get('/articles', {
    params: { userId}
  });
}

export function saveAnalysis(payload) {
  return api.post('/articles', payload);
}

export default api;
