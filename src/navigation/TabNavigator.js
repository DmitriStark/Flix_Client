import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {View, Text} from 'react-native';
import HomeScreen from '../screens/HomeScreen'; // Your movies screen
import FavoritesScreen from '../screens/FavoritesScreen';
import {resetNewFavoritesCounter} from '../redux/slices/favoritesSlice';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const dispatch = useDispatch();
  const {newFavoritesCount} = useSelector(state => state.favorites);

  const handleFavoritesTabPress = () => {
    // Reset counter when favorites tab is pressed (as per requirements)
    if (newFavoritesCount > 0) {
      dispatch(resetNewFavoritesCounter());
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'favorite' : 'favorite-border';
          }

          // Show favorites counter indicator (as per requirements)
          if (route.name === 'Favorites' && newFavoritesCount > 0) {
            return (
              <View style={{position: 'relative'}}>
                <Icon name={iconName} size={size} color={color} />
                <View
                  style={{
                    position: 'absolute',
                    right: -8,
                    top: -4,
                    backgroundColor: '#e50914',
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    minWidth: 20,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}>
                    {newFavoritesCount > 99 ? '99+' : newFavoritesCount}
                  </Text>
                </View>
              </View>
            );
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#e50914',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopColor: '#333',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Movies',
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favorites',
        }}
        listeners={{
          tabPress: handleFavoritesTabPress,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
