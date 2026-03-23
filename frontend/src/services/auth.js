import { get } from "http";
import api from "./api";
import { type } from "os";

// Authentication service
export const auth = {
  login: async (email, password) => {
    // Implement login logic
    try{
      const response = await api.post('/auth/login', { email, password });
      const { token, ...user } = response.data;

      //Save in localStorage
      const userWithId = { ...user, userId: user.id};
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userWithId));

      //axios configuration for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return {success: true, data: response.data};
    } catch (error) {
      return {
        success: false, 
        error: error.response?.data?.message || 'Invalid password or identifier' };
    }
  },

  // Inscription
  register: async (userData) => {
    try{
        console.log("Registering user:", userData);

        const response = await api.post('/auth/register', userData, {});

        const { token, ...user } = response.data;

        //Save in localStorage
        const userWithId = { ...user, userId: user.id};
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userWithId));

        //axios configuration for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        return {success: true, data: response.data};
    } catch (error) {
      console.error('Register error:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      return {
        success: false, 
        error: error.response?.data?.message || 'Registration failed',
        validationErrors: error.response?.data?.errors,
        status: error.response?.status
      };
    }  
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  },

  checkAuth: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getUser: () => {
    if (typeof window === 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
};

export default auth;