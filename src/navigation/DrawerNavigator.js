import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import TabNavigator from './TabNavigator';
import {logout} from '../redux/slices/authSlice';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = props => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await dispatch(logout()).unwrap();
            // Navigation will automatically go to LoginScreen due to isAuthenticated = false
          } catch (error) {
            console.error('Logout error:', error);
            // Force logout even if API call fails
            dispatch(logout());
          }
        },
      },
    ]);
  };

  return (
    <LinearGradient
      colors={['#141414', '#000000']}
      style={styles.drawerContainer}>
      {/* Header */}
      <View style={styles.drawerHeader}>
        <Icon name="account-circle" size={60} color="#e50914" />
        <Text style={styles.userName}>{user?.username || 'User'}</Text>
        <Text style={styles.userEmail}>
          {user?.email || 'user@menoraflix.com'}
        </Text>
      </View>

      {/* Content */}
      <View style={styles.drawerContent}>
        <Text style={styles.appTitle}>Menora Flix</Text>
        <Text style={styles.appSubtitle}>Your Netflix Experience</Text>
      </View>

      {/* Logout Button at Bottom */}
      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={24} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'overlay',
        drawerStyle: {
          width: 280,
        },
      }}>
      <Drawer.Screen
        name="Tabs"
        component={TabNavigator}
        options={{
          drawerLabel: 'Home',
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  drawerHeader: {
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  userEmail: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 4,
  },
  drawerContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    color: '#e50914',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  appSubtitle: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e50914',
    padding: 15,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default DrawerNavigator;
