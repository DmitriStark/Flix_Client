import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import LoginScreen from '../screens/loginScreen';
import DrawerNavigator from './DrawerNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const {isAuthenticated, isLoading, isInitialized} = useSelector(
    state => state.auth,
  );

  // Show loading screen while checking authentication
  if (isLoading || !isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {isAuthenticated ? (
        // User is authenticated - show main app
        <Stack.Screen name="Main" component={DrawerNavigator} />
      ) : (
        // User is not authenticated - show login
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
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

export default AppNavigator;
