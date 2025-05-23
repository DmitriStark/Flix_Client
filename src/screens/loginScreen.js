import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {login, register} from '../redux/slices/authSlice';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const {hasRegistered} = useSelector(state => state.auth);
  const [mode, setMode] = useState(hasRegistered ? 'login' : 'signup');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  useEffect(() => {
    if (hasRegistered) {
      setMode('login');
    }
  }, [hasRegistered]);

  useEffect(() => {
    if (hasCheckedStorage) {return;}

    const checkRegistrationStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('hasRegistered');
        if (value === 'true') {
          setMode('login');
        }
      } catch (error) {
        // Handle error silently
      } finally {
        setHasCheckedStorage(true);
      }
    };

    checkRegistrationStatus();
  }, [hasCheckedStorage]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 8) {
      newErrors.username = 'Username must be at least 8 characters';
    } else if (!/(?=.*[A-Z])(?=.*[a-z])/.test(username)) {
      newErrors.username =
        'Username must contain uppercase and lowercase letters';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@!$%*?&])[A-Za-z\d@!$%*?&]/.test(
        password,
      )
    ) {
      newErrors.password =
        'Password must contain uppercase, lowercase, number and special character';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [username, password]);

  const switchToLoginMode = useCallback(async () => {
    try {
      await AsyncStorage.setItem('hasRegistered', 'true');
      setPassword('');
      setErrors({});
    } catch (error) {
      setMode('login');
      setPassword('');
      setErrors({});
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setServerError('');

    try {
      if (mode === 'signup') {
        const result = await dispatch(
          register({
            username: username.trim(),
            password: password,
          }),
        ).unwrap();

        if (result?.success || result?.token) {
          await switchToLoginMode();
          Alert.alert('Success', 'Registration successful! You can now login.');
        } else {
          setServerError('Registration failed. Please try again.');
        }
      } else {
        const result = await dispatch(
          login({
            username: username.trim(),
            password: password,
          }),
        ).unwrap();

        if (result?.success || result?.token) {
          Alert.alert('Success', 'Login successful!');
        } else {
          setServerError('Login failed. Please check your credentials.');
        }
      }
    } catch (error) {
      setServerError(
        error.message ||
          `${
            mode === 'login' ? 'Login' : 'Registration'
          } failed. Please try again.`,
      );
    } finally {
      setIsLoading(false);
    }
  }, [mode, validateForm, dispatch, username, password, switchToLoginMode]);

  const toggleMode = useCallback(() => {
    const newMode = mode === 'login' ? 'signup' : 'login';
    setMode(newMode);
    setPassword('');
    setErrors({});
    setServerError('');
  }, [mode]);

  const isSignupMode = mode === 'signup';
  const showToggle = mode === 'signup';

  return (
    <ImageBackground
      source={require('../../assets/bgImg.png')}
      style={styles.container}
      resizeMode="cover">
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Menora Flix</Text>
            <Text style={styles.subtitle}>
              {isSignupMode ? 'Create Account' : 'Login'}
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Icon
                name="person"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#666"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}

            <View style={styles.inputContainer}>
              <Icon
                name="lock"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}>
                <Icon
                  name={showPassword ? 'visibility' : 'visibility-off'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isSignupMode ? 'Sign Up' : 'Login'}
                </Text>
              )}
            </TouchableOpacity>

            {serverError && (
              <Text style={styles.serverErrorText}>{serverError}</Text>
            )}

            {showToggle && (
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>Already have an account?</Text>
                <TouchableOpacity onPress={toggleMode}>
                  <Text style={styles.toggleLink}>Login</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e50914',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.8,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
    height: 50,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginLeft: 16,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: '#e50914',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  serverErrorText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  toggleText: {
    color: '#ccc',
    fontSize: 14,
    marginRight: 4,
  },
  toggleLink: {
    color: '#e50914',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;
