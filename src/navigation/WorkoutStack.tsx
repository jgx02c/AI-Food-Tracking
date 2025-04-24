import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorkoutHomeScreen from '../screens/workout/WorkoutHomeScreen';
import WorkoutTemplateScreen from '../screens/workout/WorkoutTemplateScreen';
import ActiveWorkoutScreen from '../screens/workout/ActiveWorkoutScreen';
import WorkoutCompletionScreen from '../screens/workout/WorkoutCompletionScreen';
import WorkoutDetailsScreen from '../screens/workout/WorkoutDetailsScreen';

export type WorkoutStackParamList = {
  WorkoutHome: undefined;
  WorkoutTemplate: undefined;
  ActiveWorkout: undefined;
  WorkoutCompletion: { workoutId: string };
  WorkoutDetails: { workoutId: string };
};

const Stack = createNativeStackNavigator<WorkoutStackParamList>();

const WorkoutStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right'
      }}
      initialRouteName="WorkoutHome"
    >
      {/* Main entry point - shows workout history and quick actions */}
      <Stack.Screen 
        name="WorkoutHome" 
        component={WorkoutHomeScreen}
      />

      {/* Workout template management */}
      <Stack.Screen 
        name="WorkoutTemplate" 
        component={WorkoutTemplateScreen}
      />

      {/* Active workout session */}
      <Stack.Screen 
        name="ActiveWorkout" 
        component={ActiveWorkoutScreen}
        options={{
          gestureEnabled: false, // Prevent accidental back gesture during workout
        }}
      />

      {/* Workout completion summary */}
      <Stack.Screen 
        name="WorkoutCompletion" 
        component={WorkoutCompletionScreen}
        options={{
          gestureEnabled: false, // Force user to either save or discard
        }}
      />

      {/* Detailed view of a completed workout */}
      <Stack.Screen 
        name="WorkoutDetails" 
        component={WorkoutDetailsScreen}
      />
    </Stack.Navigator>
  );
};

export default WorkoutStack; 