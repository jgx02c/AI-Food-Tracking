import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert, Platform, StatusBar, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DayStats, FoodEntry } from '../types';
import { FoodEntriesService } from '../services/foodEntries';
import { StorageService } from '../services/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutEntry, ActiveWorkout } from '../types/workout';
import Header from '../components/home/Header';
import WeightSection from '../components/home/WeightSection';
import GoalsService, { Goal } from '../services/goals';
import { Ionicons } from '@expo/vector-icons';

// Navigation
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import type { MainTabParamList } from '../types/navigation';

type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList>,
  BottomTabNavigationProp<MainTabParamList>
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
      
      console.log('Today:', todayStr);
      console.log('All workouts:', allWorkouts);
      console.log('Today\'s workouts:', todayWorkouts);
      
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
      navigation.navigate('WorkoutDetails', { workoutId: workout.id }); 
    } else {
      console.log('No matching workout found');
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

        {activeGoals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Goals</Text>
            {activeGoals.map(goal => {
              const progress = (goal.current / goal.target) * 100;
              return (
                <TouchableOpacity 
                  key={goal.id} 
                  style={styles.goalCard}
                  onPress={() => navigation.navigate('GoalDetails', { goalId: goal.id })}
                >
                  <View style={styles.goalHeader}>
                    <View style={styles.goalTitleContainer}>
                      <Ionicons 
                        name={
                          goal.type === 'food' ? 'restaurant-outline' :
                          goal.type === 'workout' ? 'fitness-outline' :
                          'scale-outline'
                        } 
                        size={20} 
                        color="#2C3E50" 
                      />
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                    </View>
                    <Text style={styles.goalProgress}>
                      {Math.round(progress)}%
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        { width: `${Math.min(progress, 100)}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.goalDetails}>
                    {goal.current} / {goal.target} {goal.unit}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weight Progress</Text>
          <WeightSection 
            currentWeight={goals.weight}
            targetWeight={goals.targetWeight}
            onPress={() => navigation.navigate('Settings')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Workouts</Text>
          <WorkoutsSection 
            todayWorkouts={todayWorkouts}
            completedWorkouts={completedWorkouts}
            onPress={() => navigation.navigate('Workout')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Stats</Text>
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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Food</Text>
          <FoodEntriesSection 
            entries={todayStats.entries}
            onPress={() => navigation.navigate('FoodEntries')}
          />
        </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 8,
  },
  goalProgress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F8F9FA',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1E4D6B',
    borderRadius: 3,
  },
  goalDetails: {
    fontSize: 12,
    color: '#7F8C8D',
  },
});

export default HomeScreen; 