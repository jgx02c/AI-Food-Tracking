# AI Food Tracking App

A React Native application that helps users track their food intake using AI-powered image recognition.

## Features

- Camera-based food recognition
- Local storage for food entries
- Workout tracking
- History view
- Settings management

## Tech Stack

- React Native
- Expo
- TypeScript
- AsyncStorage
- Piclist AI API

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npx expo start
   ```

## Environment Setup

1. Create a `.env` file in the root directory
2. Add your Piclist API key:
   ```
   PICLIST_API_KEY=your_api_key_here
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── navigation/     # Navigation configuration
├── services/       # API and storage services
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 