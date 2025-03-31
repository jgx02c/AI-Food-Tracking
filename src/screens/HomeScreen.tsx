import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DayStats, FoodEntry } from '../types';
import { FoodEntriesService } from '../services/foodEntries';
import { StorageService } from '../services/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutEntry, ActiveWorkout } from '../types/workout';
import Header from '../components/home/Header';

// Navigation
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabParamList } from '../navigation/BottomTabNavigator';
import { RootStackParamList } from '../types/navigation';
import { useNavigation } from '@react-navigation/native';

type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList>,
  NativeStackNavigationProp<BottomTabParamList>
>;

// Components
import WorkoutsSection from '../components/home/WorkoutsSection';
import StatsSection from '../components/home/StatsSection';
import FoodEntriesSection from '../components/home/FoodEntriesSection';


interface UserGoals {
  calorieGoal: string;
  proteinGoal: string;
  carbsGoal: string;
  fatGoal: string;
  weight: string;
  targetWeight: string;
}

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [todayStats, setTodayStats] = useState<DayStats>({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    entries: [],
  });
  const [refreshing, setRefreshing] = useState(false);
  const [goals, setGoals] = useState<UserGoals>({
    calorieGoal: '2000',
    proteinGoal: '150',
    carbsGoal: '200',
    fatGoal: '65',
    weight: '',
    targetWeight: '',
  });
  const [todayWorkouts, setTodayWorkouts] = useState<WorkoutEntry[]>([]);
  const [completedWorkouts, setCompletedWorkouts] = useState<ActiveWorkout[]>([]);

  const loadGoals = async () => {
    try {
      const savedGoals = await AsyncStorage.getItem('@user_goals');
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const fetchTodayEntries = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const allEntries = await FoodEntriesService.getFoodEntries();
      const todayEntries = allEntries.filter(entry => entry.date === today);
      
      const stats: DayStats = {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        entries: todayEntries,
      };

      todayEntries.forEach(entry => {
        stats.totalCalories += entry.calories;
        stats.totalProtein += entry.protein;
        stats.totalCarbs += entry.carbs;
        stats.totalFat += entry.fat;
      });

      setTodayStats(stats);
    } catch (error) {
      console.error('Error fetching today\'s entries:', error);
      Alert.alert('Error', 'Failed to fetch today\'s entries');
    }
  };

  const fetchTodayWorkouts = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const [allWorkouts, allCompletedWorkouts] = await Promise.all([
        StorageService.getWorkoutHistory(),
        StorageService.getCompletedWorkouts()
      ]);
      
      const todayWorkouts = allWorkouts.filter(workout => {
        const workoutDate = new Date(workout.date).toISOString().split('T')[0];
        return workoutDate === today;
      });
      
      setTodayWorkouts(todayWorkouts);
      setCompletedWorkouts(allCompletedWorkouts);
    } catch (error) {
      console.error('Error fetching today\'s workouts:', error);
      Alert.alert('Error', 'Failed to fetch today\'s workouts');
    }
  };

  const handleWorkoutPress = (date: string) => {
    const workout = completedWorkouts.find(w => w.startTime.toISOString() === date);
    if (workout) {
      navigation.navigate('WorkoutDetails', {workoutId: workout.id}); 
    } else {
      console.log('No matching workout found');
    }
  };
  
  

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchTodayEntries(), loadGoals(), fetchTodayWorkouts()]);
    setRefreshing(false);
  };

  useEffect(() => {
    loadGoals();
    fetchTodayEntries();
    fetchTodayWorkouts();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F0" />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Header 
          title="Today's Progress" 
          date={new Date().toLocaleDateString()} 
        />

        <WorkoutsSection 
          workouts={todayWorkouts}
          onWorkoutPress={handleWorkoutPress}
        />

        <StatsSection 
          stats={{
            calories: todayStats.totalCalories,
            protein: todayStats.totalProtein,
            carbs: todayStats.totalCarbs,
            fat: todayStats.totalFat,
          }}
          goals={{
            calories: goals.calorieGoal,
            protein: goals.proteinGoal,
            carbs: goals.carbsGoal,
            fat: goals.fatGoal,
          }}
        />

        <FoodEntriesSection 
          entries={todayStats.entries}
          onPress={() => {
            const parent = navigation.getParent();
            if (parent) {
              parent.navigate('FoodEntries');
            }
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
});

export default HomeScreen; 