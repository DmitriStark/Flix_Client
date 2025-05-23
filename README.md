# MenoraFlix 🎬

A Netflix-inspired movie streaming app built with React Native featuring user authentication, movie browsing, search functionality, and favorites management.

## 🚀 Technologies Used

- **React Native** - Mobile app framework
- **Redux Toolkit** - State management
- **React Navigation** - Navigation (Drawer + Bottom Tabs)
- **AsyncStorage** - Local data persistence
- **Redux Persist** - State persistence
- **FastImage** - Optimized image loading
- **Linear Gradient** - UI gradients
- **Vector Icons** - Material Design icons

## 📱 Features

- User authentication (Login/Register)
- Browse popular and new movies
- Advanced search with filters
- Favorites management
- Responsive UI with loading states
- Drawer navigation with user profile

## 🛠️ Installation

```bash
# Clone the repository
git clone <repository-url>
cd MenoraFlix

# Install dependencies
npm install
# or
yarn install

# Install iOS dependencies (iOS only)
cd ios && pod install && cd ..
```

## ▶️ Run Commands

```bash
# Start Metro bundler
npx react-native start

# Run on Android
npx react-native run-android

# Run on iOS
npx react-native run-ios

# Clean build (if needed)
npx react-native start --reset-cache
```

## 📋 Prerequisites

- Node.js (v14+)
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS)
- Java JDK (v11+)

## 🔧 Configuration

1. Set up your movie API endpoints in `services/api.js`
2. Configure authentication backend
3. Update app icons and splash screens as needed

---

**Developed with ❤️ using React Native**