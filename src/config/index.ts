import Constants from 'expo-constants';

interface Config {
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  foodAi: {
    apiKey: string;
    apiUrl: string;
  };
  app: {
    environment: string;
  };
}

const config: Config = {
  firebase: {
    apiKey: Constants.expoConfig?.extra?.FIREBASE_API_KEY ?? '',
    authDomain: Constants.expoConfig?.extra?.FIREBASE_AUTH_DOMAIN ?? '',
    projectId: Constants.expoConfig?.extra?.FIREBASE_PROJECT_ID ?? '',
    storageBucket: Constants.expoConfig?.extra?.FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: Constants.expoConfig?.extra?.FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: Constants.expoConfig?.extra?.FIREBASE_APP_ID ?? '',
  },
  foodAi: {
    apiKey: Constants.expoConfig?.extra?.FOOD_AI_API_KEY ?? '',
    apiUrl: Constants.expoConfig?.extra?.API_URL ?? 'https://api.piclist.ai/images/process-image',
  },
  app: {
    environment: Constants.expoConfig?.extra?.APP_ENV ?? 'development',
  },
};

export default config; 