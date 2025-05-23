import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {searchMovies, clearSearchResults} from '../redux/slices/moviesSlice';

const SearchBar = () => {
  const dispatch = useDispatch();
  const {isSearching, searchError} = useSelector(state => state.movies);

  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState(''); // movie, series, episode
  const [searchYear, setSearchYear] = useState('');

  const handleSearch = () => {
    if (searchText.trim()) {
      dispatch(
        searchMovies({
          search: searchText.trim(),
          type: searchType || undefined,
          year: searchYear || undefined,
        }),
      );
    }
  };

  const handleClear = () => {
    setSearchText('');
    setSearchType('');
    setSearchYear('');
    dispatch(clearSearchResults());
  };

  return (
    <View style={styles.container}>
      {/* Main Search Input */}
      <View style={styles.searchInputContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies, series..."
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Icon name="clear" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Filters */}
      <View style={styles.filtersContainer}>
        {/* Type Filter */}
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Type:</Text>
          <View style={styles.typeButtons}>
            {['movie', 'series', 'episode'].map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  searchType === type && styles.typeButtonActive,
                ]}
                onPress={() => setSearchType(searchType === type ? '' : type)}>
                <Text
                  style={[
                    styles.typeButtonText,
                    searchType === type && styles.typeButtonTextActive,
                  ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Year Filter */}
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Year:</Text>
          <TextInput
            style={styles.yearInput}
            placeholder="2024"
            placeholderTextColor="#666"
            value={searchYear}
            onChangeText={setSearchYear}
            keyboardType="numeric"
            maxLength={4}
          />
        </View>
      </View>

      {/* Search Button */}
      <TouchableOpacity
        style={[
          styles.searchButton,
          isSearching && styles.searchButtonDisabled,
        ]}
        onPress={handleSearch}
        disabled={isSearching || !searchText.trim()}>
        {isSearching ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <Icon name="search" size={20} color="#fff" />
            <Text style={styles.searchButtonText}>Search</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Search Error */}
      {searchError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{searchError}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: '#fff',
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  filtersContainer: {
    marginBottom: 12,
  },
  filterGroup: {
    marginBottom: 8,
  },
  filterLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  typeButtonActive: {
    backgroundColor: '#e50914',
    borderColor: '#e50914',
  },
  typeButtonText: {
    color: '#ccc',
    fontSize: 12,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  yearInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#fff',
    fontSize: 14,
    width: 80,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e50914',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(220, 53, 69, 0.2)',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#dc3545',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
  },
});

export default SearchBar;
