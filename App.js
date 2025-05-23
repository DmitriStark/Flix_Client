import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {store, persistor} from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import {verifyToken} from './src/redux/slices/authSlice';
import {loadFavoritesFromStorage} from './src/redux/slices/favoritesSlice';

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#e50914" />
  </View>
);

const App = () => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing Menora Flix app...');

        await store.dispatch(loadFavoritesFromStorage());

        await store.dispatch(verifyToken());

        console.log('App initialization complete');
      } catch (err) {
        console.log(
          'App initialization completed with expected auth check failure',
        );
      }
    };

    const timer = setTimeout(initializeApp, 100);

    return () => clearTimeout(timer);
  }, []);

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
