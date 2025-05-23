import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {authAPI} from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, {rejectWithValue}) => {
    try {
      console.log('AuthSlice: Attempting registration with:', userData);
      const response = await authAPI.register(userData);
      console.log('AuthSlice: Registration response:', response);
      return response;
    } catch (error) {
      console.error('AuthSlice: Registration error:', error);
      // Return serializable error message instead of Error object
      return rejectWithValue({
        message: error.message || 'Registration failed',
        success: false,
      });
    }
  },
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, {rejectWithValue}) => {
    try {
      console.log('AuthSlice: Attempting login with:', credentials);
      const response = await authAPI.login(credentials);
      console.log('AuthSlice: Login response:', response);
      return response;
    } catch (error) {
      console.error('AuthSlice: Login error:', error);
      // Return serializable error message instead of Error object
      return rejectWithValue({
        message: error.message || 'Login failed',
        success: false,
      });
    }
  },
);

// Verify token (check if user is still authenticated)
export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, {rejectWithValue}) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        // Return serializable error instead of throwing Error
        return rejectWithValue({
          message: 'No token found',
          success: false,
        });
      }

      const response = await authAPI.verifyToken(token);
      return response;
    } catch (error) {
      console.error('AuthSlice: Token verification error:', error);
      // Clear invalid token
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');

      // Return serializable error message
      return rejectWithValue({
        message: error.message || 'Token verification failed',
        success: false,
      });
    }
  },
);

// Logout user
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, {rejectWithValue}) => {
    try {
      const response = await authAPI.logout();
      return response;
    } catch (error) {
      console.error('AuthSlice: Logout error:', error);
      // Even if API fails, clear local storage
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');

      // Return serializable error message
      return rejectWithValue({
        message: error.message || 'Logout failed',
        success: false,
      });
    }
  },
);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false, // To track if we've checked for existing auth
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setInitialized: state => {
      state.isInitialized = true;
    },
    // Manual logout (for drawer logout button)
    clearAuth: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Register cases
      .addCase(register.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Don't auto-login after registration, let user login manually
        console.log('Registration successful:', action.payload);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Registration failed';
      })

      // Login cases
      .addCase(login.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.isInitialized = true;
        console.log('Login successful:', action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Login failed';
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isInitialized = true;
      })

      // Token verification cases
      .addCase(verifyToken.pending, state => {
        state.isLoading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        state.isInitialized = true;
        console.log('Token verification successful');
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isInitialized = true;
        // Don't set error for "No token found" as it's expected behavior
        if (action.payload?.message !== 'No token found') {
          state.error = action.payload?.message || 'Authentication failed';
        }
        console.log('Token verification failed (expected for new users)');
      })

      // Logout cases
      .addCase(logout.pending, state => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, state => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        console.log('Logout successful');
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        // Even if logout fails, clear local state
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || 'Logout failed';
      });
  },
});

export const {clearError, setInitialized, clearAuth} = authSlice.actions;
export default authSlice.reducer;
