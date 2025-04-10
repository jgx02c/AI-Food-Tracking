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
      bundleIdentifier: 'com.yourcompany.aifoodtracking'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.yourcompany.aifoodtracking'
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
        projectId: 'your-project-id'
      }
    }
  }
}; 