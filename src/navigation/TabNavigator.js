import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {View, Text, StyleSheet} from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import {resetNewFavoritesCounter} from '../redux/slices/favoritesSlice';

const Tab = createBottomTabNavigator();

const TabIconWithBadge = ({iconName, size, color, badgeCount}) => {
  if (badgeCount > 0) {
    return (
      <View style={styles.iconContainer}>
        <Icon name={iconName} size={size} color={color} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {badgeCount > 99 ? '99+' : badgeCount}
          </Text>
        </View>
      </View>
    );
  }

  return <Icon name={iconName} size={size} color={color} />;
};

const TabNavigator = () => {
  const dispatch = useDispatch();
  const {newFavoritesCount} = useSelector(state => state.favorites);

  const handleFavoritesTabPress = () => {
    if (newFavoritesCount > 0) {
      dispatch(resetNewFavoritesCounter());
    }
  };

  const renderTabBarIcon = ({route, focused, color, size}) => {
    let iconName;

    if (route.name === 'Home') {
      iconName = 'home';
    } else if (route.name === 'Favorites') {
      iconName = focused ? 'favorite' : 'favorite-border';
    }

    if (route.name === 'Favorites') {
      return (
        <TabIconWithBadge
          iconName={iconName}
          size={size}
          color={color}
          badgeCount={newFavoritesCount}
        />
      );
    }

    return <Icon name={iconName} size={size} color={color} />;
  };

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) =>
          renderTabBarIcon({route, focused, color, size}),
        tabBarActiveTintColor: '#e50914',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
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

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
  },
  badge: {
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
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabBar: {
    backgroundColor: '#1a1a1a',
    borderTopColor: '#333',
    paddingBottom: 5,
    paddingTop: 5,
    height: 60,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default TabNavigator;
