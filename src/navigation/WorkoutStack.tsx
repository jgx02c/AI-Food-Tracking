import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorkoutScreen from '../screens/WorkoutScreen';
import WorkoutDetailsScreen from '../screens/WorkoutDetailsScreen';

const Stack = createNativeStackNavigator();

export type WorkoutStackParamList = {
  WorkoutHome: undefined;
  WorkoutDetails: { workoutId: string };
};

const WorkoutStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WorkoutHome" component={WorkoutScreen} />
      <Stack.Screen name="WorkoutDetails" component={WorkoutDetailsScreen} />
    </Stack.Navigator>
  );
};

export default WorkoutStack; 