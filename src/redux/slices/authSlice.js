import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {authAPI} from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const register = createAsyncThunk(
  'auth/register',
  async (userData, {rejectWithValue}) => {
    try {
      const response = await authAPI.register(userData);

      if (response && (response.success || response.token)) {
        return response;
      } else {
        return rejectWithValue({
          message: 'Registration failed - invalid response',
          success: false,
        });
      }
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Registration failed',
        success: false,
      });
    }
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, {rejectWithValue}) => {
    try {
      const response = await authAPI.login(credentials);

      if (response?.token && response?.user) {
        await AsyncStorage.setItem('authToken', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Login failed',
        success: false,
      });
    }
  },
);

export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, {rejectWithValue}) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        return rejectWithValue({
          message: 'No token found',
          success: false,
        });
      }
      const response = await authAPI.verifyToken(token);
      return response;
    } catch (error) {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      return rejectWithValue({
        message: error.message || 'Token verification failed',
        success: false,
      });
    }
  },
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, {rejectWithValue}) => {
    try {
      const response = await authAPI.logout();
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      return response;
    } catch (error) {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
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
  isInitialized: false,
  hasRegistered: false,
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
    clearAuth: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setHasRegistered: state => {
      state.hasRegistered = true;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(register.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.hasRegistered = true;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Registration failed';
      })
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
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Login failed';
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isInitialized = true;
      })
      .addCase(verifyToken.pending, state => {
        state.isLoading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isInitialized = true;
        if (action.payload?.message !== 'No token found') {
          state.error = action.payload?.message || 'Authentication failed';
        }
      })
      .addCase(logout.pending, state => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, state => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || 'Logout failed';
      });
  },
});

export const {clearError, setInitialized, clearAuth, setHasRegistered} =
  authSlice.actions;
export default authSlice.reducer;
