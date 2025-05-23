import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  resetNewFavoritesCounter,
  removeFromFavorites,
} from '../redux/slices/favoritesSlice';
import FastImage from 'react-native-fast-image';

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {favorites} = useSelector(state => state.favorites);

  useEffect(() => {
    // Reset the new favorites counter when user visits this screen
    dispatch(resetNewFavoritesCounter());
  }, [dispatch]);

  const openDrawer = () => {
    navigation.openDrawer();
  };

  const handleRemoveFavorite = imdbID => {
    dispatch(removeFromFavorites(imdbID));
  };

  const renderFavoriteMovie = ({item}) => (
    <View style={styles.movieItem}>
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

      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {item.Title}
        </Text>
        <Text style={styles.movieYear}>Year: {item.Year}</Text>
        <Text style={styles.movieId}>imdbID: {item.imdbID}</Text>
        <Text style={styles.movieType}>Type: {item.Type}</Text>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item.imdbID)}>
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No favorite movies yet</Text>
      <Text style={styles.emptySubtext}>
        Go to the home screen and add some movies to your favorites!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorites</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Favorites List */}
      <FlatList
        data={favorites}
        keyExtractor={item => item.imdbID}
        renderItem={renderFavoriteMovie}
        contentContainerStyle={[
          styles.listContainer,
          favorites.length === 0 && styles.emptyListContainer,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight + 10,
    paddingBottom: 15,
    backgroundColor: '#E50914',
  },
  menuButton: {
    padding: 5,
  },
  menuLine: {
    width: 25,
    height: 3,
    backgroundColor: '#fff',
    marginVertical: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 35,
  },
  listContainer: {
    padding: 20,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  movieItem: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  moviePoster: {
    width: 60,
    height: 90,
    borderRadius: 5,
    marginRight: 15,
  },
  movieInfo: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  movieYear: {
    fontSize: 14,
    color: '#999',
    marginBottom: 2,
  },
  movieId: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  movieType: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  removeButton: {
    backgroundColor: '#E50914',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default FavoritesScreen;
