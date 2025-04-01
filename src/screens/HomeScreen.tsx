import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DayStats } from '../types';
import { FoodEntriesService } from '../services/foodEntries';
import { StorageService } from '../services/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutEntry, ActiveWorkout } from '../types/workout';
import Header from '../components/home/Header';
import GoalsService, { Goal } from '../services/goals';

// Navigation
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import type { MainTabParamList } from '../types/navigation';

// Components
import ActiveGoalsSection from '../components/home/ActiveGoalsSection';
import WeightProgressSection from '../components/home/WeightProgressSection';
import WorkoutsProgressSection from '../components/home/WorkoutsProgressSection';
import StatsProgressSection from '../components/home/StatsProgressSection';
import FoodEntriesProgressSection from '../components/home/FoodEntriesProgressSection';

// Types
import { UserGoals } from '../types/home';

type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList>,
  BottomTabNavigationProp<MainTabParamList>
>;

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
  const [activeGoals, setActiveGoals] = useState<Goal[]>([]);

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

  const loadActiveGoals = async () => {
    try {
      const goals = await GoalsService.getActiveGoals();
      setActiveGoals(goals);
    } catch (error) {
      console.error('Error loading active goals:', error);
    }
  };

  const fetchTodayEntries = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString();
      
      const allEntries = await FoodEntriesService.getFoodEntries();
      const todayEntries = allEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.toISOString() === todayStr;
      });
      
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
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split('T')[0];
      
      const [allWorkouts, allCompletedWorkouts] = await Promise.all([
        StorageService.getWorkoutHistory(),
        StorageService.getCompletedWorkouts()
      ]);
      
      const todayWorkouts = allWorkouts.filter(workout => {
        const workoutDate = new Date(workout.date);
        workoutDate.setHours(0, 0, 0, 0);
        return workoutDate.toISOString().split('T')[0] === todayStr;
      });
      
      setTodayWorkouts(todayWorkouts);
      setCompletedWorkouts(allCompletedWorkouts);
    } catch (error) {
      console.error('Error fetching today\'s workouts:', error);
      Alert.alert('Error', 'Failed to fetch today\'s workouts');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchTodayEntries(), loadGoals(), loadActiveGoals(), fetchTodayWorkouts()]);
    setRefreshing(false);
  };

  useEffect(() => {
    loadGoals();
    loadActiveGoals();
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

        <ActiveGoalsSection 
          goals={activeGoals}
          onGoalPress={(goalId) => navigation.navigate('GoalDetails', { goalId })}
        />

        <WeightProgressSection 
          currentWeight={goals.weight}
          targetWeight={goals.targetWeight}
          onPress={() => navigation.navigate('Settings')}
        />

        <WorkoutsProgressSection 
          todayWorkouts={todayWorkouts}
          completedWorkouts={completedWorkouts}
          onPress={() => navigation.navigate('Workout')}
        />

        <StatsProgressSection 
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

        <FoodEntriesProgressSection 
          entries={todayStats.entries}
          onPress={() => navigation.navigate('FoodEntries')}
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