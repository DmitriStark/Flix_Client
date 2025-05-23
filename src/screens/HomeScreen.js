import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native'; // Add this import
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchBar from '../components/SearchBar';
import {
  fetchPopularMovies,
  fetchNewMovies,
  setSelectedMovie,
  fetchMovieDetails,
} from '../redux/slices/moviesSlice';
import {
  addToFavorites,
  removeFromFavorites,
} from '../redux/slices/favoritesSlice';

const {width} = Dimensions.get('window');

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation(); // Add this line
  const {
    popularMovies,
    newMovies,
    selectedMovie,
    isLoadingPopular,
    isLoadingNew,
    error,
    searchResults,
    searchTerm,
  } = useSelector(state => state.movies);

  const {favorites} = useSelector(state => state.favorites);

  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    // Load both carousels on screen mount (two API calls as per requirements)
    dispatch(fetchPopularMovies());
    dispatch(fetchNewMovies());
  }, [dispatch]);

  // Add this function to open the drawer
  const openDrawer = () => {
    navigation.openDrawer();
  };

  const handleMoviePress = async movie => {
    try {
      // Set selected movie for immediate UI update
      dispatch(setSelectedMovie(movie));

      // Fetch detailed movie information if we have imdbID
      if (movie.imdbID) {
        dispatch(fetchMovieDetails(movie.imdbID));
      }
    } catch (error) {
      console.error('Failed to load movie details:', error);
    }
  };

  const handleFavoritePress = movie => {
    const isFavorite = favorites.some(fav => fav.imdbID === movie.imdbID);

    if (isFavorite) {
      dispatch(removeFromFavorites(movie.imdbID));
    } else {
      dispatch(addToFavorites(movie));
    }
  };

  const renderMovieItem = (movie, index) => {
    const isFavorite = favorites.some(fav => fav.imdbID === movie.imdbID);

    return (
      <TouchableOpacity
        key={`${movie.imdbID}-${index}`}
        style={styles.movieItem}
        onPress={() => handleMoviePress(movie)}>
        <FastImage
          source={{
            uri:
              movie.Poster && movie.Poster !== 'N/A'
                ? movie.Poster
                : 'https://via.placeholder.com/200x300/333/fff?text=No+Image',
            priority: FastImage.priority.normal,
          }}
          style={styles.moviePoster}
          resizeMode={FastImage.resizeMode.cover}
        />

        {/* Favorite Star Button - Shows indication when selected */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => handleFavoritePress(movie)}>
          <Icon
            name={isFavorite ? 'star' : 'star-border'}
            size={24}
            color={isFavorite ? '#FFD700' : '#fff'}
          />
        </TouchableOpacity>

        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {movie.Title}
          </Text>
          <Text style={styles.movieYear}>{movie.Year}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCarousel = (movies, title, isLoading) => {
    if (isLoading) {
      return (
        <View style={styles.carouselContainer}>
          <Text style={styles.carouselTitle}>{title}</Text>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#e50914" />
            <Text style={styles.loadingText}>
              Loading {title.toLowerCase()}...
            </Text>
          </View>
        </View>
      );
    }

    if (!movies || movies.length === 0) {
      return (
        <View style={styles.carouselContainer}>
          <Text style={styles.carouselTitle}>{title}</Text>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No movies found</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.carouselContainer}>
        <Text style={styles.carouselTitle}>{title}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}>
          {movies.map((movie, index) => renderMovieItem(movie, index))}
        </ScrollView>
      </View>
    );
  };

  const renderMovieDetails = () => {
    if (!selectedMovie) return null;

    return (
      <View style={styles.movieDetailsContainer}>
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)']}
          style={styles.movieDetailsGradient}>
          <View style={styles.movieDetailsContent}>
            <FastImage
              source={{
                uri:
                  selectedMovie.Poster && selectedMovie.Poster !== 'N/A'
                    ? selectedMovie.Poster
                    : 'https://via.placeholder.com/150x200/333/fff?text=No+Image',
              }}
              style={styles.selectedMoviePoster}
              resizeMode={FastImage.resizeMode.cover}
            />

            <View style={styles.selectedMovieInfo}>
              <Text style={styles.selectedMovieTitle}>
                {selectedMovie.Title}
              </Text>

              <View style={styles.movieMetadata}>
                <Text style={styles.movieMeta}>
                  {selectedMovie.Year} • {selectedMovie.Type || 'Movie'}
                </Text>
                {selectedMovie.imdbRating && (
                  <Text style={styles.movieRating}>
                    ⭐ {selectedMovie.imdbRating}
                  </Text>
                )}
              </View>

              {selectedMovie.Plot && selectedMovie.Plot !== 'N/A' && (
                <Text style={styles.moviePlot} numberOfLines={4}>
                  {selectedMovie.Plot}
                </Text>
              )}

              {selectedMovie.Genre && selectedMovie.Genre !== 'N/A' && (
                <Text style={styles.movieGenre}>{selectedMovie.Genre}</Text>
              )}
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  // Determine which movies to show based on search results
  // Successful search = 6+ movies (as per requirements)
  const displayPopularMovies =
    searchResults.length > 0 ? searchResults : popularMovies;
  const displayNewMovies =
    searchResults.length > 0 ? searchResults.slice(5) : newMovies;

  return (
    <LinearGradient colors={['#141414', '#000000']} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header with Drawer Menu and Search Toggle */}
        <View style={styles.header}>
          {/* Add hamburger menu button */}
          <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Menora Flix</Text>

          <TouchableOpacity
            style={styles.searchToggle}
            onPress={() => setShowSearch(!showSearch)}>
            <Icon name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar (Bonus Feature) */}
        {showSearch && <SearchBar />}

        {/* Search Results Info */}
        {searchTerm && (
          <View style={styles.searchInfo}>
            <Text style={styles.searchInfoText}>
              Search results for: "{searchTerm}"
            </Text>
            {searchResults.length >= 6 && (
              <Text style={styles.successfulSearchText}>
                ✅ Successful search ({searchResults.length} movies found)
              </Text>
            )}
          </View>
        )}

        {/* Movie Details (Middle Component as per requirements) */}
        {renderMovieDetails()}

        {/* First Carousel - Popular Movies */}
        {renderCarousel(
          displayPopularMovies,
          searchTerm ? 'Search Results' : 'Popular Movies',
          isLoadingPopular,
        )}

        {/* Second Carousel - New Movies */}
        {renderCarousel(
          displayNewMovies,
          searchTerm ? 'More Results' : 'New Movies',
          isLoadingNew,
        )}

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                dispatch(fetchPopularMovies());
                dispatch(fetchNewMovies());
              }}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 46,
    paddingBottom: 8,
  },
  // Add styles for the menu button
  menuButton: {
    padding: 5,
    width: 35, // Give it a consistent width
  },
  menuLine: {
    width: 25,
    height: 3,
    backgroundColor: '#fff',
    marginVertical: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e50914',
    flex: 1, // Take up available space
    textAlign: 'center', // Center the title
  },
  searchToggle: {
    padding: 8,
    width: 35, // Give it a consistent width to match the menu button
  },
  searchInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInfoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  successfulSearchText: {
    color: '#28a745',
    fontSize: 14,
    fontWeight: '500',
  },
  carouselContainer: {
    marginBottom: 24,
  },
  carouselTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 16,
    marginBottom: 12,
  },
  carousel: {
    paddingLeft: 16,
  },
  movieItem: {
    marginRight: 12,
    width: 120,
  },
  moviePoster: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
  movieInfo: {
    marginTop: 8,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  movieYear: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
  movieDetailsContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  movieDetailsGradient: {
    padding: 16,
  },
  movieDetailsContent: {
    flexDirection: 'row',
  },
  selectedMoviePoster: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginRight: 16,
  },
  selectedMovieInfo: {
    flex: 1,
  },
  selectedMovieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  movieMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  movieMeta: {
    color: '#ccc',
    fontSize: 14,
    marginRight: 12,
  },
  movieRating: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  moviePlot: {
    color: '#ddd',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  movieGenre: {
    color: '#e50914',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: 'rgba(220, 53, 69, 0.2)',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#e50914',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default HomeScreen;
