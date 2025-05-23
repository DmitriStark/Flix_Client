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

import authSlice from './slices/authSlice';
import moviesSlice from './slices/moviesSlice';
import favoritesSlice from './slices/favoritesSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'favorites'],
};

const rootReducer = combineReducers({
  auth: authSlice,
  movies: moviesSlice,
  favorites: favoritesSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['items.dates'],
      },
      immutableCheck: {
        warnAfter: 128,
      },
    }),
  devTools: __DEV__,
});

export const persistor = persistStore(store);

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

if (__DEV__) {
  store.subscribe(() => {
    const state = store.getState();
    const safeState = safeLog(state);
    console.log('Redux State Updated:', safeState);
  });
}
