import React, {useState} from 'react';
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
} from 'react-native';
import {useDispatch} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {login, register} from '../redux/slices/authSlice';

const LoginScreen = () => {
  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Username validation (8+ chars, uppercase and lowercase)
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 8) {
      newErrors.username = 'Username must be at least 8 characters';
    } else if (!/(?=.*[A-Z])(?=.*[a-z])/.test(formData.username)) {
      newErrors.username =
        'Username must contain uppercase and lowercase letters';
    }

    // Email validation (only for registration)
    if (!isLogin) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    }

    // Password validation (6+ chars, uppercase, lowercase, number, special char)
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (
      !isLogin &&
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        formData.password,
      )
    ) {
      newErrors.password =
        'Password must contain uppercase, lowercase, number and special character';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        const loginData = {
          username: formData.username.trim(),
          password: formData.password,
        };

        console.log('Attempting login with:', loginData);
        const result = await dispatch(login(loginData)).unwrap();

        if (result.success) {
          Alert.alert('Success', 'Login successful!');
        }
      } else {
        // Register
        const registerData = {
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
        };

        console.log('Attempting registration with:', registerData);
        const result = await dispatch(register(registerData)).unwrap();

        if (result.success) {
          Alert.alert('Success', 'Registration successful! You can now login.');
          // Switch to login mode after successful registration
          setIsLogin(true);
          setFormData({username: formData.username, email: '', password: ''});
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert(
        'Error',
        error.message ||
          `${isLogin ? 'Login' : 'Registration'} failed. Please try again.`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    // Keep username but clear other fields when switching modes
    setFormData({
      username: formData.username,
      email: '',
      password: '',
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };

  return (
    <LinearGradient colors={['#141414', '#000000']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Menora Flix</Text>
            <Text style={styles.subtitle}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Username Field */}
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
                value={formData.username}
                onChangeText={value => handleInputChange('username', value)}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}

            {/* Email Field (Registration Only) */}
            {!isLogin && (
              <>
                <View style={styles.inputContainer}>
                  <Icon
                    name="email"
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#666"
                    value={formData.email}
                    onChangeText={value => handleInputChange('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </>
            )}

            {/* Password Field */}
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
                value={formData.password}
                onChangeText={value => handleInputChange('password', value)}
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

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isLogin ? 'Login' : 'Sign Up'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Toggle Mode */}
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleText}>
                {isLogin
                  ? "Don't have an account?"
                  : 'Already have an account?'}
              </Text>
              <TouchableOpacity onPress={toggleMode}>
                <Text style={styles.toggleLink}>
                  {isLogin ? 'Sign Up' : 'Login'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Requirements Info (Registration Only) */}
          {!isLogin && (
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>
                Password Requirements:
              </Text>
              <Text style={styles.requirementText}>
                • At least 6 characters
              </Text>
              <Text style={styles.requirementText}>
                • Contains uppercase letter
              </Text>
              <Text style={styles.requirementText}>
                • Contains lowercase letter
              </Text>
              <Text style={styles.requirementText}>• Contains number</Text>
              <Text style={styles.requirementText}>
                • Contains special character (@$!%*?&)
              </Text>

              <Text style={styles.requirementsTitle}>
                Username Requirements:
              </Text>
              <Text style={styles.requirementText}>
                • At least 8 characters
              </Text>
              <Text style={styles.requirementText}>
                • Contains uppercase and lowercase letters
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  requirementsContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#e50914',
  },
  requirementsTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
  },
  requirementText: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 4,
    marginLeft: 8,
  },
});

export default LoginScreen;
