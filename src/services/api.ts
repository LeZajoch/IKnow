import axios from 'axios';
import { User, Quiz, QuizResult } from '@/types';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/users/register', { username, email, password });
    return response.data;
  },
  
  login: async (username: string, password: string) => {
    const response = await api.post('/users/login', { username, password });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
};

// Quiz API
export const quizAPI = {
  getQuizzes: async () => {
    const response = await api.get('/quizzes');
    return response.data;
  },
  
  getQuizById: async (quizId: string) => {
    const response = await api.get(`/quizzes/${quizId}`);
    return response.data;
  },
  
  getUserQuizzes: async () => {
    const response = await api.get('/quizzes/user/me');
    return response.data;
  },
  
  createQuiz: async (quizData: Omit<Quiz, 'id' | 'createdAt' | 'createdBy'>) => {
    const response = await api.post('/quizzes', quizData);
    return response.data;
  },
  
  updateQuiz: async (quizId: string, quizData: Omit<Quiz, 'id' | 'createdAt' | 'createdBy'>) => {
    const response = await api.put(`/quizzes/${quizId}`, quizData);
    return response.data;
  },
  
  deleteQuiz: async (quizId: string) => {
    const response = await api.delete(`/quizzes/${quizId}`);
    return response.data;
  },
};

// Quiz Results API
export const resultAPI = {
  saveQuizResult: async (resultData: Omit<QuizResult, 'dateTaken' | 'userId'>) => {
    const response = await api.post('/results', resultData);
    return response.data;
  },
  
  getUserResults: async () => {
    const response = await api.get('/results/user/me');
    return response.data;
  },
};
