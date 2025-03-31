import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';


const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  MainTabs: undefined;
  FoodEntries: undefined;
};

const AppNavigator = () => {
  console.log('AppNavigator rendered');
  
  return (
    <NavigationContainer onStateChange={(state) => {
      console.log('Navigation state changed:', state);
    }}>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
        }}
      >
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
    
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;