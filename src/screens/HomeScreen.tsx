import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DayStats, FoodEntry } from '../types';
import { getFoodEntriesForDate } from '../services/foodEntries';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserGoals {
  calorieGoal: string;
  proteinGoal: string;
  carbsGoal: string;
  fatGoal: string;
  weight: string;
  targetWeight: string;
}

const HomeScreen = () => {
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
      const entries = await getFoodEntriesForDate(today);
      
      const stats: DayStats = {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        entries,
      };

      entries.forEach(entry => {
        stats.totalCalories += entry.calories;
        stats.totalProtein += entry.nutrients.protein;
        stats.totalCarbs += entry.nutrients.carbs;
        stats.totalFat += entry.nutrients.fat;
      });

      setTodayStats(stats);
    } catch (error) {
      console.error('Error fetching today\'s entries:', error);
      Alert.alert('Error', 'Failed to fetch today\'s entries');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchTodayEntries(), loadGoals()]);
    setRefreshing(false);
  };

  useEffect(() => {
    loadGoals();
    fetchTodayEntries();
  }, []);

  const getProgressColor = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage > 100) return '#A67356'; // Warm Cognac
    if (percentage > 90) return '#829AAF'; // Muted Steel Blue
    return '#739E82'; // Sage Green
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
        <View style={styles.statsContainer}>
          <Text style={styles.title}>Today's Progress</Text>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Calories</Text>
            <Text style={[
              styles.statValue,
              { color: getProgressColor(todayStats.totalCalories, parseInt(goals.calorieGoal)) }
            ]}>
              {todayStats.totalCalories} / {goals.calorieGoal}
            </Text>
          </View>
          <View style={styles.nutrientsContainer}>
            <View style={styles.nutrient}>
              <Text style={styles.nutrientLabel}>Protein</Text>
              <Text style={[styles.nutrientValue, { 
                color: getProgressColor(todayStats.totalProtein, parseInt(goals.proteinGoal))
              }]}>
                {todayStats.totalProtein}g / {goals.proteinGoal}g
              </Text>
            </View>
            <View style={styles.nutrient}>
              <Text style={styles.nutrientLabel}>Carbs</Text>
              <Text style={[styles.nutrientValue, { 
                color: getProgressColor(todayStats.totalCarbs, parseInt(goals.carbsGoal))
              }]}>
                {todayStats.totalCarbs}g / {goals.carbsGoal}g
              </Text>
            </View>
            <View style={styles.nutrient}>
              <Text style={styles.nutrientLabel}>Fat</Text>
              <Text style={[styles.nutrientValue, { 
                color: getProgressColor(todayStats.totalFat, parseInt(goals.fatGoal))
              }]}>
                {todayStats.totalFat}g / {goals.fatGoal}g
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.entriesContainer}>
          <Text style={styles.sectionTitle}>Today's Entries</Text>
          {todayStats.entries.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No food entries yet today</Text>
              <Text style={styles.emptyStateSubtext}>Use the camera to add your first meal!</Text>
            </View>
          ) : (
            todayStats.entries.map((entry) => (
              <View key={entry.id} style={styles.entryCard}>
                <Text style={styles.entryTitle}>{entry.description}</Text>
                <Text style={styles.entryCalories}>{entry.calories} calories</Text>
                <Text style={styles.entryNutrients}>
                  P: {entry.nutrients.protein}g | C: {entry.nutrients.carbs}g | F: {entry.nutrients.fat}g
                </Text>
              </View>
            ))
          )}
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
    paddingBottom: 20,
  },
  statsContainer: {
    backgroundColor: '#fff',
    padding: 24,
    margin: 16,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#2C3D4F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    color: '#2C3D4F',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    letterSpacing: -0.5,
  },
  stat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F0',
  },
  statLabel: {
    fontSize: 18,
    color: '#2C3D4F',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  nutrientsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutrient: {
    alignItems: 'center',
    flex: 1,
  },
  nutrientLabel: {
    fontSize: 15,
    marginBottom: 6,
    color: '#829AAF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '500',
  },
  nutrientValue: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  entriesContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#2C3D4F',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    letterSpacing: -0.5,
  },
  entryCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#2C3D4F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  entryTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
    color: '#2C3D4F',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  entryCalories: {
    fontSize: 15,
    color: '#1E4D6B',
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '500',
  },
  entryNutrients: {
    fontSize: 14,
    color: '#829AAF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginTop: 8,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#2C3D4F',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 15,
    color: '#829AAF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '500',
  },
});

export default HomeScreen; 