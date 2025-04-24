import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from './src/types/navigation';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Import screens
import HomeScreen from './src/screens/home/HomeScreen';
import GoalsScreen from './src/screens/goals/GoalsScreen';
import WorkoutStack from './src/navigation/WorkoutStack';
import FoodEntriesScreen from './src/screens/food/FoodEntriesScreen';
import WorkoutDetailsScreen from './src/screens/workout/WorkoutDetailsScreen';
import CameraScreen from './src/screens/food/CameraScreen';
import CreateGoalScreen from './src/screens/goals/CreateGoalScreen';
import GoalDetailsScreen from './src/screens/goals/GoalDetailsScreen';
import SettingsStack from './src/navigation/SettingsStack';
import ManualFoodEntryScreen from './src/screens/food/ManualFoodEntryScreen';
import AddWeightScreen from './src/screens/home/AddWeightScreen';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

const BackButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity 
      style={{ marginLeft: 16, flexDirection: 'row', alignItems: 'center' }}
      onPress={() => navigation.goBack()}
    >
      <Ionicons name="chevron-back" size={24} color="#2C3E50" />
      <Text style={{ marginLeft: 4, color: '#2C3E50' }}>Back</Text>
    </TouchableOpacity>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerLeft: () => <BackButton />,
        }}
      >
        <Stack.Screen 
          name="MainTabs" 
          component={BottomTabNavigator} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Camera" 
          component={CameraScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ManualFoodEntry" 
          component={ManualFoodEntryScreen}
          options={{ title: 'Add Food' }}
        />
        <Stack.Screen 
          name="AddWeight" 
          component={AddWeightScreen}
          options={{ title: 'Add Weight' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
