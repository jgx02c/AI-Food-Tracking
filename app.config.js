import 'dotenv/config';

module.exports = {
  expo: {
    name: 'AI Food Tracking',
    slug: 'ai-food-tracking',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.aifoodtracking.app',
      buildNumber: '1',
      infoPlist: {
        NSCameraUsageDescription: "This app uses the camera to take photos of food for tracking purposes.",
        NSPhotoLibraryUsageDescription: "This app accesses your photos to upload food images for tracking."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.aifoodtracking.app'
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'webpack',
      output: 'static',
      build: {
        babel: {
          include: ['@react-native-async-storage/async-storage']
        }
      },
      pwa: {
        enabled: true,
        startUrl: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        backgroundColor: '#ffffff',
        themeColor: '#000000',
        icon: './assets/icon.png',
        splash: {
          image: './assets/splash.png',
          resizeMode: 'contain',
          backgroundColor: '#ffffff'
        }
      }
    },
    extra: {
      eas: {
        projectId: "9f8a15c8-b319-46f6-bbf2-eb0e36e4a28f"
      }
    },
    plugins: [
      "expo-camera"
    ]
  }
}; 