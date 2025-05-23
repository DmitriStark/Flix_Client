import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Base URL - Use correct IP for your setup
const API_BASE_URL = 'http://10.0.2.2:5000/api'; // Android emulator
// For iOS simulator use: 'http://localhost:5000/api'
// For physical device use your computer's IP: 'http://192.168.1.XXX:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  async config => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Log request for debugging
      console.log('API Request:', {
        method: config.method,
        url: config.url,
        data: config.data,
        headers: config.headers,
      });
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  error => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  response => {
    console.log('API Response:', response.data);
    return response;
  },
  async error => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  register: async userData => {
    try {
      console.log('Registering user:', userData);

      // Ensure data is properly formatted
      const requestData = {
        username: userData.username?.toString().trim(),
        email: userData.email?.toString().trim(),
        password: userData.password?.toString(),
      };

      console.log('Sending registration data:', requestData);

      const response = await api.post('/users/register', requestData);

      if (response.data.success && response.data.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw (
        error.response?.data || {
          success: false,
          message: 'Registration failed: ' + (error.message || 'Unknown error'),
        }
      );
    }
  },

  login: async credentials => {
    try {
      console.log('Logging in user:', credentials);

      // Ensure data is properly formatted
      const requestData = {
        username: credentials.username?.toString().trim(),
        password: credentials.password?.toString(),
      };

      console.log('Sending login data:', requestData);

      const response = await api.post('/users/login', requestData);

      if (response.data.success && response.data.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw (
        error.response?.data || {
          success: false,
          message: 'Login failed: ' + (error.message || 'Unknown error'),
        }
      );
    }
  },

  verifyToken: async token => {
    try {
      const response = await api.get('/users/profile', {
        headers: {Authorization: `Bearer ${token}`},
      });
      return response.data;
    } catch (error) {
      console.error('Token verification error:', error);
      throw (
        error.response?.data || {
          success: false,
          message: 'Token verification failed',
        }
      );
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      return {success: true};
    } catch (error) {
      console.error('Logout error:', error);
      return {success: false};
    }
  },
};

// Movies API with OMDB integration
export const movieAPI = {
  // Get popular movies (first carousel)
  getPopularMovies: async () => {
    try {
      const response = await api.get('/movies/popular');
      return response.data;
    } catch (error) {
      console.error('Popular movies error:', error);
      throw (
        error.response?.data || {
          success: false,
          message: 'Failed to fetch popular movies',
        }
      );
    }
  },

  // Get new movies (second carousel)
  getNewMovies: async () => {
    try {
      const response = await api.get('/movies/new');
      return response.data;
    } catch (error) {
      console.error('New movies error:', error);
      throw (
        error.response?.data || {
          success: false,
          message: 'Failed to fetch new movies',
        }
      );
    }
  },

  // Search movies with parameters (Search, Type, Year)
  searchMovies: async ({search, type, year}) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (type) params.append('type', type);
      if (year) params.append('year', year);

      const response = await api.get(`/movies/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Search movies error:', error);
      throw (
        error.response?.data || {
          success: false,
          message: 'Failed to search movies',
        }
      );
    }
  },

  // Get movie details
  getMovieDetails: async imdbID => {
    try {
      const response = await api.get(`/movies/details/${imdbID}`);
      return response.data;
    } catch (error) {
      console.error('Movie details error:', error);
      throw (
        error.response?.data || {
          success: false,
          message: 'Failed to fetch movie details',
        }
      );
    }
  },
};

export default api;
