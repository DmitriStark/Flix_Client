import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../redux/slices/favoritesSlice';
import FastImage from 'react-native-fast-image';

const MovieDescription = ({ movie }) => {
  const dispatch = useDispatch();
  const favoriteMovies = useSelector((state) => state.favorites.favoriteMovies);

  const isFavorite = favoriteMovies.some(fav => fav.imdbID === movie.imdbID);

  const handleFavoritePress = () => {
    dispatch(toggleFavorite(movie));
  };

  if (!movie) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.movieInfo}>
        <FastImage
          source={{
            uri: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150x220/333/fff?text=No+Image',
            priority: FastImage.priority.normal,
          }}
          style={styles.moviePoster}
          resizeMode={FastImage.resizeMode.cover}
        />
        
        <View style={styles.movieDetails}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {movie.Title}
          </Text>
          <Text style={styles.movieYear}>Year: {movie.Year}</Text>
          <Text style={styles.movieId}>imdbID: {movie.imdbID}</Text>
          <Text style={styles.movieType}>Type: {movie.Type}</Text>
          
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoritePress}
          >
            <Text style={[
              styles.favoriteIcon,
              isFavorite && styles.favoriteIconActive
            ]}>
              ★
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 15,
  },
  movieInfo: {
    flexDirection: 'row',
  },
  moviePoster: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginRight: 15,
  },
  movieDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    lineHeight: 24,
  },
  movieYear: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  movieId: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  movieType: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 15,
  },
  favoriteButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 20,
    color: '#666',
  },
  favoriteIconActive: {
    color: '#FFD700',
  },
});

export default MovieDescription;