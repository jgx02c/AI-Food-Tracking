# AI Food Tracking App

A modern React Native application that leverages artificial intelligence to revolutionize personal nutrition tracking. This app uses advanced image recognition technology to identify food items from photos, making food logging more accurate and effortless than traditional manual entry methods.

## 🎯 Project Overview

The AI Food Tracking App is designed to simplify the process of tracking daily nutrition by using computer vision to automatically identify food items from photos. It combines the power of AI with a user-friendly interface to help users maintain better dietary habits and achieve their health goals.

## ✨ Key Features

### 🍽️ Smart Food Recognition
- Real-time food identification using AI-powered image recognition
- Automatic nutritional information extraction
- Support for multiple food items in a single image
- High accuracy food classification

### 📱 User Experience
- Intuitive camera interface for quick food logging
- Customizable portion sizes and serving suggestions
- Daily and weekly nutrition summaries
- Progress tracking and goal setting

### 💪 Workout Integration
- Exercise logging and tracking
- Calorie expenditure calculation
- Workout history and progress visualization
- Integration with food tracking for complete health monitoring

### 📊 Data Management
- Local storage for offline access
- Cloud backup and sync capabilities
- Export functionality for data analysis
- Privacy-focused data handling

## 🛠️ Technical Stack

- **Frontend Framework**: React Native with Expo
- **Programming Language**: TypeScript
- **State Management**: React Context API
- **Storage**: AsyncStorage for local data persistence
- **AI Integration**: Piclist AI API for food recognition
- **UI Components**: React Native Paper
- **Navigation**: React Navigation
- **Testing**: Jest and React Native Testing Library

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-food-tracking.git
   cd ai-food-tracking
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your Piclist API key:
     ```
     PICLIST_API_KEY=your_api_key_here
     ```

4. Start the development server:
   ```bash
   npx expo start
   ```

5. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── common/     # Shared components
│   ├── food/       # Food-related components
│   └── workout/    # Workout-related components
├── screens/        # Screen components
│   ├── camera/     # Camera and food recognition
│   ├── history/    # Food and workout history
│   └── settings/   # User preferences
├── navigation/     # Navigation configuration
├── services/       # API and storage services
│   ├── api/        # External API integrations
│   └── storage/    # Local storage management
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── hooks/          # Custom React hooks
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Include tests for new features
- Update documentation as needed
- Follow the existing code style

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [Piclist AI](https://piclist.ai/) for the food recognition API
- All contributors who have helped improve this project

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers directly. 