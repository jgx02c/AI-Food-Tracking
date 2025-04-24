import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FoodEntriesScreen from '../screens/food/FoodEntriesScreen';
import ManualFoodEntryScreen from '../screens/food/ManualFoodEntryScreen';
import CameraScreen from '../screens/camera/CameraScreen';
import FoodLoadingScreen from '../screens/food/FoodLoadingScreen';
import FoodReviewScreen from '../screens/food/FoodReviewScreen';

export type FoodEntry = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
};

export type FoodStackParamList = {
  FoodEntries: undefined;
  ManualFoodEntry: undefined;
  Camera: undefined;
  FoodLoading: { imageUri: string };
  FoodReview: { 
    prediction: {
      name: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    }
  };
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
          title: 'Add Food Manually',
        }}
      />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          title: 'Take Photo',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FoodLoading"
        component={FoodLoadingScreen}
        options={{
          title: 'Analyzing Food',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FoodReview"
        component={FoodReviewScreen}
        options={{
          title: 'Review Food',
        }}
      />
    </Stack.Navigator>
  );
};

export default FoodStack; 