import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
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
      
      // Calculate totals
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
    if (percentage > 100) return '#FF6B6B';
    if (percentage > 90) return '#FFD93D';
    return '#4CAF50';
  };

  return (
    <ScrollView 
      style={styles.container}
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
            <Text style={{ 
              color: getProgressColor(todayStats.totalProtein, parseInt(goals.proteinGoal))
            }}>
              {todayStats.totalProtein}g / {goals.proteinGoal}g
            </Text>
          </View>
          <View style={styles.nutrient}>
            <Text style={styles.nutrientLabel}>Carbs</Text>
            <Text style={{ 
              color: getProgressColor(todayStats.totalCarbs, parseInt(goals.carbsGoal))
            }}>
              {todayStats.totalCarbs}g / {goals.carbsGoal}g
            </Text>
          </View>
          <View style={styles.nutrient}>
            <Text style={styles.nutrientLabel}>Fat</Text>
            <Text style={{ 
              color: getProgressColor(todayStats.totalFat, parseInt(goals.fatGoal))
            }}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  stat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statLabel: {
    fontSize: 18,
    color: '#666',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  nutrientsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutrient: {
    alignItems: 'center',
  },
  nutrientLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  entriesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  entryCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  entryCalories: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  entryNutrients: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default HomeScreen; 