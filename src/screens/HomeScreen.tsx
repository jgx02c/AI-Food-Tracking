import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DayStats, FoodEntry } from '../types';
import { FoodEntriesService } from '../services/foodEntries';
import { StorageService } from '../services/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface UserGoals {
  calorieGoal: string;
  proteinGoal: string;
  carbsGoal: string;
  fatGoal: string;
  weight: string;
  targetWeight: string;
}

interface WorkoutSession {
  id: string;
  templateId: string;
  date: string;
  exercises: {
    id: string;
    name: string;
    sets: {
      reps: number;
      weight?: number;
      completed: boolean;
    }[];
  }[];
  duration: number;
}

const HomeScreen = () => {
  const navigation = useNavigation();
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
  const [todayWorkouts, setTodayWorkouts] = useState<WorkoutSession[]>([]);

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
      const allWorkouts = await StorageService.getWorkoutSessions();
      const todayWorkouts = allWorkouts.filter(workout => workout.date === today);
      setTodayWorkouts(todayWorkouts);
    } catch (error) {
      console.error('Error fetching today\'s workouts:', error);
      Alert.alert('Error', 'Failed to fetch today\'s workouts');
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

  const getProgressColor = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage > 100) return '#A67356'; // Warm Cognac
    if (percentage > 90) return '#829AAF'; // Muted Steel Blue
    return '#739E82'; // Sage Green
  };

  const getProgressMessage = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage > 100) return 'Over goal';
    if (percentage > 90) return 'Almost there!';
    if (percentage > 70) return 'On track';
    if (percentage > 50) return 'Keep going';
    return 'Need to catch up';
  };

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
        <View style={styles.header}>
          <Text style={styles.title}>Today's Progress</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
        </View>

        {todayWorkouts.length > 0 && (
          <View style={styles.workoutsContainer}>
            <Text style={styles.sectionTitle}>Today's Workouts</Text>
            {todayWorkouts.map(workout => (
              <TouchableOpacity 
                key={workout.id} 
                style={styles.workoutCard}
                onPress={() => navigation.navigate('WorkoutDetails', { workoutId: workout.id })}
              >
                <View style={styles.workoutHeader}>
                  <Ionicons name="barbell-outline" size={24} color="#2C3E50" />
                  <Text style={styles.workoutTitle}>Workout Session</Text>
                  <Ionicons name="chevron-forward" size={20} color="#7F8C8D" style={styles.chevron} />
                </View>
                <Text style={styles.workoutDuration}>
                  Duration: {Math.round(workout.duration / 60)} minutes
                </Text>
                <View style={styles.exerciseList}>
                  {workout.exercises.map(exercise => (
                    <View key={exercise.id} style={styles.exerciseItem}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <Text style={styles.exerciseSets}>
                        {exercise.sets.length} sets completed
                      </Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Calories</Text>
            <Text style={styles.statValue}>{todayStats.totalCalories}</Text>
            <Text style={styles.statGoal}>Goal: {goals.calorieGoal}</Text>
            <Text style={[styles.progressMessage, { color: getProgressColor(todayStats.totalCalories, parseInt(goals.calorieGoal)) }]}>
              {getProgressMessage(todayStats.totalCalories, parseInt(goals.calorieGoal))}
            </Text>
            <View style={[styles.progressBar, { backgroundColor: getProgressColor(todayStats.totalCalories, parseInt(goals.calorieGoal)) }]} />
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Protein</Text>
            <Text style={styles.statValue}>{todayStats.totalProtein}g</Text>
            <Text style={styles.statGoal}>Goal: {goals.proteinGoal}g</Text>
            <Text style={[styles.progressMessage, { color: getProgressColor(todayStats.totalProtein, parseInt(goals.proteinGoal)) }]}>
              {getProgressMessage(todayStats.totalProtein, parseInt(goals.proteinGoal))}
            </Text>
            <View style={[styles.progressBar, { backgroundColor: getProgressColor(todayStats.totalProtein, parseInt(goals.proteinGoal)) }]} />
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Carbs</Text>
            <Text style={styles.statValue}>{todayStats.totalCarbs}g</Text>
            <Text style={styles.statGoal}>Goal: {goals.carbsGoal}g</Text>
            <Text style={[styles.progressMessage, { color: getProgressColor(todayStats.totalCarbs, parseInt(goals.carbsGoal)) }]}>
              {getProgressMessage(todayStats.totalCarbs, parseInt(goals.carbsGoal))}
            </Text>
            <View style={[styles.progressBar, { backgroundColor: getProgressColor(todayStats.totalCarbs, parseInt(goals.carbsGoal)) }]} />
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Fat</Text>
            <Text style={styles.statValue}>{todayStats.totalFat}g</Text>
            <Text style={styles.statGoal}>Goal: {goals.fatGoal}g</Text>
            <Text style={[styles.progressMessage, { color: getProgressColor(todayStats.totalFat, parseInt(goals.fatGoal)) }]}>
              {getProgressMessage(todayStats.totalFat, parseInt(goals.fatGoal))}
            </Text>
            <View style={[styles.progressBar, { backgroundColor: getProgressColor(todayStats.totalFat, parseInt(goals.fatGoal)) }]} />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.entriesContainer}
          onPress={() => navigation.navigate('FoodEntries')}
        >
          <View style={styles.entriesHeader}>
            <Text style={styles.sectionTitle}>Today's Food Entries</Text>
            <Ionicons name="chevron-forward" size={20} color="#7F8C8D" />
          </View>
          {todayStats.entries.length === 0 ? (
            <Text style={styles.emptyText}>No entries for today</Text>
          ) : (
            <>
              {todayStats.entries.slice(0, 3).map(entry => (
                <View key={entry.id} style={styles.entryCard}>
                  <Text style={styles.entryName}>{entry.name}</Text>
                  <View style={styles.entryDetails}>
                    <Text style={styles.entryCalories}>{entry.calories} cal</Text>
                    <Text style={styles.entryMacros}>
                      P: {entry.protein}g | C: {entry.carbs}g | F: {entry.fat}g
                    </Text>
                  </View>
                </View>
              ))}
              {todayStats.entries.length > 3 && (
                <Text style={styles.viewMoreText}>
                  View {todayStats.entries.length - 3} more entries
                </Text>
              )}
            </>
          )}
        </TouchableOpacity>
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  statGoal: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  progressMessage: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  workoutsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  workoutCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 8,
  },
  workoutDuration: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  exerciseList: {
    marginTop: 8,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  exerciseName: {
    fontSize: 14,
    color: '#2C3E50',
  },
  exerciseSets: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  entriesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#7F8C8D',
    fontSize: 16,
  },
  entryCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  entryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  entryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryCalories: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  entryMacros: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  chevron: {
    marginLeft: 'auto',
  },
  entriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  viewMoreText: {
    textAlign: 'center',
    color: '#7F8C8D',
    fontSize: 14,
    marginTop: 8,
  },
});

export default HomeScreen; 