import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  favorites: [], // Initialize as empty array
  newFavoritesCount: 0, // Counter for new favorites indicator
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      const movie = action.payload;

      // Ensure favorites array exists
      if (!Array.isArray(state.favorites)) {
        state.favorites = [];
      }

      // Check if already in favorites
      const exists = state.favorites.find(fav => fav.imdbID === movie.imdbID);
      if (!exists) {
        state.favorites.push(movie);
        state.newFavoritesCount += 1; // Increment new favorites counter

        // Save to AsyncStorage (don't await in Redux)
        AsyncStorage.setItem(
          'favorites',
          JSON.stringify(state.favorites),
        ).catch(error => console.error('Error saving favorites:', error));

        console.log('Added to favorites:', movie.Title);
      } else {
        console.log('Movie already in favorites:', movie.Title);
      }
    },

    removeFromFavorites: (state, action) => {
      const imdbID = action.payload;

      // Ensure favorites array exists
      if (!Array.isArray(state.favorites)) {
        state.favorites = [];
        return;
      }

      const initialLength = state.favorites.length;
      state.favorites = state.favorites.filter(
        movie => movie.imdbID !== imdbID,
      );

      // Only save if something was actually removed
      if (state.favorites.length !== initialLength) {
        // Save to AsyncStorage
        AsyncStorage.setItem(
          'favorites',
          JSON.stringify(state.favorites),
        ).catch(error => console.error('Error saving favorites:', error));
        console.log('Removed from favorites:', imdbID);
      }
    },

    loadFavorites: (state, action) => {
      // Ensure payload is an array
      state.favorites = Array.isArray(action.payload) ? action.payload : [];
      console.log('Loaded favorites:', state.favorites.length, 'items');
    },

    // Reset counter when visiting favorites screen (as per requirements)
    resetNewFavoritesCounter: state => {
      state.newFavoritesCount = 0;
      console.log('Reset new favorites counter');
    },

    clearAllFavorites: state => {
      state.favorites = [];
      state.newFavoritesCount = 0;
      AsyncStorage.removeItem('favorites').catch(error =>
        console.error('Error clearing favorites:', error),
      );
      console.log('Cleared all favorites');
    },
  },
});

// Async action to load favorites from storage
export const loadFavoritesFromStorage = () => async dispatch => {
  try {
    const favoritesString = await AsyncStorage.getItem('favorites');
    if (favoritesString) {
      const favorites = JSON.parse(favoritesString);
      // Ensure it's an array before dispatching
      if (Array.isArray(favorites)) {
        dispatch(loadFavorites(favorites));
        console.log(
          'Loaded favorites from storage:',
          favorites.length,
          'items',
        );
      } else {
        console.warn(
          'Invalid favorites data in storage, resetting to empty array',
        );
        dispatch(loadFavorites([]));
      }
    } else {
      console.log('No favorites found in storage');
      dispatch(loadFavorites([]));
    }
  } catch (error) {
    console.error('Error loading favorites from storage:', error);
    dispatch(loadFavorites([])); // Fallback to empty array
  }
};

export const {
  addToFavorites,
  removeFromFavorites,
  loadFavorites,
  resetNewFavoritesCounter,
  clearAllFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
