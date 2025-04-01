import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorkoutScreen from '../screens/WorkoutScreen';
import ActiveWorkoutScreen from '../screens/ActiveWorkoutScreen';
import WorkoutCompletionScreen from '../screens/WorkoutCompletionScreen';
import WorkoutDetailsScreen from '../screens/WorkoutDetailsScreen';

const Stack = createNativeStackNavigator();

export type WorkoutStackParamList = {
  WorkoutHome: undefined;
  ActiveWorkout: undefined;
  WorkoutCompletion: { workoutId: string };
  WorkoutDetails: { workoutId: string };
};

const WorkoutStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WorkoutHome" component={WorkoutScreen} />
      <Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
      <Stack.Screen name="WorkoutCompletion" component={WorkoutCompletionScreen} />
      <Stack.Screen name="WorkoutDetails" component={WorkoutDetailsScreen} />
    </Stack.Navigator>
  );
};

export default WorkoutStack; 