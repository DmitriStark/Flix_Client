import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {store, persistor} from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import {verifyToken} from './src/redux/slices/authSlice';
import {loadFavoritesFromStorage} from './src/redux/slices/favoritesSlice';

const App = () => {
  useEffect(() => {
    // Initialize app after store is ready
    const initializeApp = async () => {
      try {
        console.log('Initializing Menora Flix app...');

        // Load favorites from storage first
        await store.dispatch(loadFavoritesFromStorage());

        // Then check for existing authentication
        await store.dispatch(verifyToken());

        console.log('App initialization complete');
      } catch (error) {
        console.log(
          'App initialization completed with expected auth check failure',
        );
      }
    };

    // Wait a bit for persistor to rehydrate, then initialize
    const timer = setTimeout(initializeApp, 100);

    return () => clearTimeout(timer);
  }, []);

  const LoadingScreen = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#e50914" />
    </View>
  );

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});

export default App;
