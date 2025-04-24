import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FoodEntriesScreen from '../screens/food/FoodEntriesScreen';
import ManualFoodEntryScreen from '../screens/food/ManualFoodEntryScreen';

export type FoodStackParamList = {
  FoodEntries: undefined;
  ManualFoodEntry: undefined;
};

const Stack = createNativeStackNavigator<FoodStackParamList>();

const FoodStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FoodEntries"
        component={FoodEntriesScreen}
        options={{
          title: 'Food',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ManualFoodEntry"
        component={ManualFoodEntryScreen}
        options={{
          title: 'Add Food',
        }}
      />
    </Stack.Navigator>
  );
};

export default FoodStack; 