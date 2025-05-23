import React from 'react';
import {View, FlatList, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {toggleFavorite} from '../redux/slices/favoritesSlice';
import FastImage from 'react-native-fast-image';

const MovieCarousel = ({movies, onMoviePress}) => {
  const dispatch = useDispatch();
  const favoriteMovies = useSelector(state => state.favorites.favoriteMovies);

  const isFavorite = imdbID => {
    return favoriteMovies.some(movie => movie.imdbID === imdbID);
  };

  const handleFavoritePress = movie => {
    dispatch(toggleFavorite(movie));
  };

  const renderMovieItem = ({item}) => (
    <TouchableOpacity
      style={styles.movieContainer}
      onPress={() => onMoviePress(item)}>
      <View style={styles.movieCard}>
        <FastImage
          source={{
            uri:
              item.Poster !== 'N/A'
                ? item.Poster
                : 'https://via.placeholder.com/150x220/333/fff?text=No+Image',
            priority: FastImage.priority.normal,
          }}
          style={styles.moviePoster}
          resizeMode={FastImage.resizeMode.cover}
        />

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => handleFavoritePress(item)}>
          <Text
            style={[
              styles.favoriteIcon,
              isFavorite(item.imdbID) && styles.favoriteIconActive,
            ]}>
            ★
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (!movies || movies.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No movies available</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={movies}
      keyExtractor={item => item.imdbID}
      renderItem={renderMovieItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.carouselContainer}
    />
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    paddingHorizontal: 15,
  },
  movieContainer: {
    marginHorizontal: 5,
  },
  movieCard: {
    position: 'relative',
    width: 120,
    height: 180,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#333',
  },
  moviePoster: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 16,
    color: '#666',
  },
  favoriteIconActive: {
    color: '#FFD700',
  },
  emptyContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default MovieCarousel;
