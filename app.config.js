import 'dotenv/config';

export default {
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
      bundleIdentifier: 'com.yourcompany.aifoodtracking',
      infoPlist: {
        NSCameraUsageDescription: 'This app needs access to the camera to take pictures of food for tracking.',
        NSPhotoLibraryUsageDescription: 'This app needs access to your photos to save food pictures.',
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.yourcompany.aifoodtracking',
      permissions: [
        'CAMERA',
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE'
      ]
    },
    web: {
      favicon: './assets/favicon.png'
    },
    plugins: [
      [
        'expo-camera',
        {
          cameraPermission: 'Allow AI Food Tracker to access your camera to take pictures of food.'
        }
      ]
    ],
    extra: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FOOD_AI_API_KEY: process.env.FOOD_AI_API_KEY,
      API_URL: process.env.API_URL,
      APP_ENV: process.env.APP_ENV,
      eas: {
        projectId: process.env.EAS_PROJECT_ID
      }
    },
    newArchEnabled: true
  }
}; 