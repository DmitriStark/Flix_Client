import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  favorites: [],
  newFavoritesCount: 0,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      const movie = action.payload;

      if (!Array.isArray(state.favorites)) {
        state.favorites = [];
      }

      const exists = state.favorites.find(fav => fav.imdbID === movie.imdbID);
      if (!exists) {
        state.favorites.push(movie);
        state.newFavoritesCount += 1;

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

      if (!Array.isArray(state.favorites)) {
        state.favorites = [];
        return;
      }

      const initialLength = state.favorites.length;
      state.favorites = state.favorites.filter(
        movie => movie.imdbID !== imdbID,
      );

      if (state.favorites.length !== initialLength) {
        AsyncStorage.setItem(
          'favorites',
          JSON.stringify(state.favorites),
        ).catch(error => console.error('Error saving favorites:', error));
        console.log('Removed from favorites:', imdbID);
      }
    },

    loadFavorites: (state, action) => {
      state.favorites = Array.isArray(action.payload) ? action.payload : [];
      console.log('Loaded favorites:', state.favorites.length, 'items');
    },

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

export const loadFavoritesFromStorage = () => async dispatch => {
  try {
    const favoritesString = await AsyncStorage.getItem('favorites');
    if (favoritesString) {
      const favorites = JSON.parse(favoritesString);
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
    dispatch(loadFavorites([]));
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
