import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {movieAPI} from '../../services/api';

// Fetch popular movies (first carousel)
export const fetchPopularMovies = createAsyncThunk(
  'movies/fetchPopularMovies',
  async (_, {rejectWithValue}) => {
    try {
      const response = await movieAPI.getPopularMovies();
      if (response.success) {
        return response.movies;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch popular movies');
    }
  },
);

// Fetch new movies (second carousel)
export const fetchNewMovies = createAsyncThunk(
  'movies/fetchNewMovies',
  async (_, {rejectWithValue}) => {
    try {
      const response = await movieAPI.getNewMovies();
      if (response.success) {
        return response.movies;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch new movies');
    }
  },
);

// Search movies with parameters (Search, Type, Year)
export const searchMovies = createAsyncThunk(
  'movies/searchMovies',
  async ({search, type, year}, {rejectWithValue}) => {
    try {
      const response = await movieAPI.searchMovies({search, type, year});
      if (response.success) {
        return {
          movies: response.movies,
          searchTerm: search,
          isSuccessful: response.movies.length >= 6, // Successful search = 6+ movies
        };
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to search movies');
    }
  },
);

// Fetch movie details
export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchMovieDetails',
  async (imdbID, {rejectWithValue}) => {
    try {
      const response = await movieAPI.getMovieDetails(imdbID);
      if (response.success) {
        return response.movie;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch movie details');
    }
  },
);

const initialState = {
  popularMovies: [],
  newMovies: [],
  searchResults: [],
  selectedMovie: null,
  searchTerm: '',
  isLoadingPopular: false,
  isLoadingNew: false,
  isSearching: false,
  isLoadingDetails: false,
  error: null,
  searchError: null,
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
      state.searchError = null;
    },
    clearSearchResults: state => {
      state.searchResults = [];
      state.searchTerm = '';
      state.searchError = null;
    },
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload;
    },
    clearSelectedMovie: state => {
      state.selectedMovie = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch Popular Movies
      .addCase(fetchPopularMovies.pending, state => {
        state.isLoadingPopular = true;
        state.error = null;
      })
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        state.isLoadingPopular = false;
        state.popularMovies = action.payload;
        state.error = null;
      })
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.isLoadingPopular = false;
        state.error = action.payload;
      })
      // Fetch New Movies
      .addCase(fetchNewMovies.pending, state => {
        state.isLoadingNew = true;
        state.error = null;
      })
      .addCase(fetchNewMovies.fulfilled, (state, action) => {
        state.isLoadingNew = false;
        state.newMovies = action.payload;
        state.error = null;
      })
      .addCase(fetchNewMovies.rejected, (state, action) => {
        state.isLoadingNew = false;
        state.error = action.payload;
      })
      // Search Movies
      .addCase(searchMovies.pending, state => {
        state.isSearching = true;
        state.searchError = null;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = action.payload.movies;
        state.searchTerm = action.payload.searchTerm;
        state.searchError = null;

        // Update carousels if search is successful (6+ movies)
        if (action.payload.isSuccessful) {
          state.popularMovies = action.payload.movies.slice(0, 10);
          state.newMovies = action.payload.movies.slice(5, 15);
        }
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.isSearching = false;
        state.searchError = action.payload;
        state.searchResults = [];
      })
      // Fetch Movie Details
      .addCase(fetchMovieDetails.pending, state => {
        state.isLoadingDetails = true;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.isLoadingDetails = false;
        state.selectedMovie = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.isLoadingDetails = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearSearchResults,
  setSelectedMovie,
  clearSelectedMovie,
} = moviesSlice.actions;

export default moviesSlice.reducer;
