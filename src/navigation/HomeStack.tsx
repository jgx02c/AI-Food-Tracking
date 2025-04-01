import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import WorkoutDetailsScreen from '../screens/WorkoutDetailsScreen';
import FoodEntriesScreen from '../screens/FoodEntriesScreen';

// HomeStackParamList.ts
export type HomeStackParamList = {
  Home: undefined;  // Home screen does not take parameters
  WorkoutDetails: { workoutId: string };  // WorkoutDetails screen takes workoutId parameter
  FoodEntries: undefined;
};

// Pass the type to createNativeStackNavigator
const Stack = createNativeStackNavigator<HomeStackParamList>();




const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="WorkoutDetails" component={WorkoutDetailsScreen} />
      <Stack.Screen name="FoodEntries" component={FoodEntriesScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
