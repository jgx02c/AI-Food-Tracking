import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              switch (route.name) {
                case 'Home':
                  iconName = focused ? 'home' : 'home-outline';
                  break;
                case 'Camera':
                  iconName = focused ? 'camera' : 'camera-outline';
                  break;
                case 'History':
                  iconName = focused ? 'calendar' : 'calendar-outline';
                  break;
                case 'Workout':
                  iconName = focused ? 'fitness' : 'fitness-outline';
                  break;
                case 'Settings':
                  iconName = focused ? 'settings' : 'settings-outline';
                  break;
                default:
                  iconName = 'help-outline';
              }

              return <Ionicons name={iconName as any} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#1E4D6B',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Camera" component={CameraScreen} />
          <Tab.Screen name="History" component={HistoryScreen} />
          <Tab.Screen name="Workout" component={WorkoutScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
