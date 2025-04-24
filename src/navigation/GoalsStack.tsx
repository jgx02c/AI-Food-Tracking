import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GoalsScreen from '../screens/goals/GoalsScreen';
import CreateGoalScreen from '../screens/goals/CreateGoalScreen';
import GoalDetailsScreen from '../screens/goals/GoalDetailsScreen';

export type GoalsStackParamList = {
  Goals: undefined;
  CreateGoal: undefined;
  GoalDetails: { goalId: string };
};

const Stack = createNativeStackNavigator<GoalsStackParamList>();

const GoalsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Goals"
        component={GoalsScreen}
        options={{
          title: 'Goals',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CreateGoal"
        component={CreateGoalScreen}
        options={{
          title: 'Create Goal',
        }}
      />
      <Stack.Screen
        name="GoalDetails"
        component={GoalDetailsScreen}
        options={{
          title: 'Goal Details',
        }}
      />
    </Stack.Navigator>
  );
};

export default GoalsStack; 