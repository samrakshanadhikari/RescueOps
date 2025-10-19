import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Help Request API calls
export const helpRequestAPI = {
  submit: (situation, wordCount) => 
    api.post('/help-request', { situation, wordCount }),
  
  getById: (id) => 
    api.get(`/help-request/${id}`),
  
  getPending: () => 
    api.get('/help-request/pending'),
  
  getAll: (filters = {}) => 
    api.get('/help-request', { params: filters }),
  
  classify: (id, classification) => 
    api.put(`/help-request/${id}/classify`, { classification }),
};

// Gemini API calls
export const geminiAPI = {
  analyze: (userText) =>
    api.post('/gemini/analyze', { userText }),
};

// Map API calls
export const mapAPI = {
  findNearby: (placeType, latitude, longitude) =>
    api.post('/map/nearby', { placeType, latitude, longitude }),
};

export default api;

