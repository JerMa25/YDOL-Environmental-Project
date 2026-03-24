import { api } from './api';

export const auth = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userRole', response.role);
        localStorage.setItem('userName', response.userName);
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response && response.token) {
        localStorage.setItem('token', response.token);
      }
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    window.location.href = '/connexion';
  },

  getToken: () => localStorage.getItem('token'),

  isAuthenticated: () => !!localStorage.getItem('token'),

  getUserRole: () => localStorage.getItem('userRole'),
};