import {configureStore} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from '@reduxjs/toolkit';

// Import your slices
import authSlice from './slices/authSlice';
import moviesSlice from './slices/moviesSlice';
import favoritesSlice from './slices/favoritesSlice';

// Persist config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'favorites'], // Only persist auth and favorites
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authSlice,
  movies: moviesSlice,
  favorites: favoritesSlice,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with better serialization handling
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types from redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these field paths in the state
        ignoredPaths: ['items.dates'],
      },
      // Disable immutability check in development for better performance
      immutableCheck: {
        warnAfter: 128,
      },
    }),
  devTools: __DEV__, // Enable Redux DevTools in development
});

export const persistor = persistStore(store);

// Safe logging function
const safeLog = state => {
  try {
    const authState = state?.auth || {};
    const favoritesState = state?.favorites || {};

    return {
      auth: {
        isAuthenticated: Boolean(authState.isAuthenticated),
        isLoading: Boolean(authState.isLoading),
        isInitialized: Boolean(authState.isInitialized),
        hasUser: Boolean(authState.user),
        error: authState.error || null,
      },
      favorites: {
        count: Array.isArray(favoritesState.favorites)
          ? favoritesState.favorites.length
          : 0,
        newCount: Number(favoritesState.newFavoritesCount) || 0,
      },
      movies: {
        popularCount: Array.isArray(state?.movies?.popularMovies)
          ? state.movies.popularMovies.length
          : 0,
        newCount: Array.isArray(state?.movies?.newMovies)
          ? state.movies.newMovies.length
          : 0,
        isLoading: Boolean(
          state?.movies?.isLoadingPopular || state?.movies?.isLoadingNew,
        ),
      },
    };
  } catch (error) {
    console.error('Error in Redux state logging:', error);
    return {error: 'Failed to log state'};
  }
};

// Log store state changes in development
if (__DEV__) {
  store.subscribe(() => {
    const state = store.getState();
    const safeState = safeLog(state);
    console.log('Redux State Updated:', safeState);
  });
}
