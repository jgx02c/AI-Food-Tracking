# AI Food Tracking App

A mobile application built with Expo and TypeScript for tracking food intake using AI-powered image recognition.

## Features

- Take photos of food to automatically log nutrition information
- Track daily calorie and nutrient intake
- View historical food logs with calendar integration
- Set and monitor nutrition goals

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with your API keys:
```
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_auth_domain_here
FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
FIREBASE_APP_ID=your_app_id_here
FOOD_AI_API_KEY=your_food_ai_api_key_here
```

3. Start the development server:
```bash
npm start
```

4. Open the app in Expo Go on your device by scanning the QR code.

## Technology Stack

- Expo SDK 52
- React Native
- TypeScript
- Firebase (Backend & Storage)
- React Navigation
- Expo Camera
- React Native Calendars

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── screens/        # Screen components
  ├── navigation/     # Navigation configuration
  ├── services/       # Firebase and API services
  ├── types/         # TypeScript type definitions
  ├── utils/         # Utility functions
  └── hooks/         # Custom React hooks
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 