import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import WorkoutDetailsScreen from '../screens/workout/WorkoutDetailsScreen';
import AddWeightScreen from '../screens/AddWeightScreen';

// HomeStackParamList.ts
export type HomeStackParamList = {
  Home: undefined;  // Home screen does not take parameters
  WorkoutDetails: { workoutId: string };  // WorkoutDetails screen takes workoutId parameter
  AddWeight: undefined;
};

// Pass the type to createNativeStackNavigator
const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="WorkoutDetails" 
        component={WorkoutDetailsScreen}
        options={{
          title: 'Workout Details',
        }}
      />
      <Stack.Screen 
        name="AddWeight" 
        component={AddWeightScreen}
        options={{
          title: 'Add Weight',
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
