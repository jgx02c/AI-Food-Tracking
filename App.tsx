import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, MainTabParamList } from './src/types/navigation';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import FoodEntriesScreen from './src/screens/FoodEntriesScreen';
import WorkoutDetailsScreen from './src/screens/WorkoutDetailsScreen';
import CameraScreen from './src/screens/CameraScreen';
import CreateGoalScreen from './src/screens/CreateGoalScreen';
import GoalDetailsScreen from './src/screens/GoalDetailsScreen';
import SettingsStack from './src/navigation/SettingsStack';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

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

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Goals') {
            iconName = focused ? 'flag' : 'flag-outline';
          } else if (route.name === 'Workout') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'FoodEntries') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'PicList') {
            iconName = focused ? 'camera' : 'camera-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1E4D6B',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Goals" component={GoalsScreen} />
      <Tab.Screen name="Workout" component={WorkoutScreen} />
      <Tab.Screen name="FoodEntries" component={FoodEntriesScreen} />
      <Tab.Screen name="PicList" component={SettingsStack} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen 
          name="WorkoutDetails" 
          component={WorkoutDetailsScreen}
          options={{
            headerShown: true,
            title: '',
            headerStyle: {
              backgroundColor: '#F5F5F0',
            },
            headerShadowVisible: false,
            headerLeft: () => <BackButton />,
          }}
        />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen 
          name="CreateGoal" 
          component={CreateGoalScreen}
          options={{
            headerShown: true,
            title: '',
            headerStyle: {
              backgroundColor: '#F5F5F0',
            },
            headerShadowVisible: false,
            headerLeft: () => <BackButton />,
          }}
        />
        <Stack.Screen 
          name="GoalDetails" 
          component={GoalDetailsScreen}
          options={{
            headerShown: true,
            title: '',
            headerStyle: {
              backgroundColor: '#F5F5F0',
            },
            headerShadowVisible: false,
            headerLeft: () => <BackButton />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
