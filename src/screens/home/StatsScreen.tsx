import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../services/storage';
import { WorkoutEntry } from '../types/workout';
import { FoodEntry } from '../services/storage';
import { format, startOfDay, endOfDay } from 'date-fns';

const StatsScreen = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today');
  const [todayWorkouts, setTodayWorkouts] = useState<WorkoutEntry[]>([]);
  const [todayFood, setTodayFood] = useState<FoodEntry[]>([]);
  const [history, setHistory] = useState<(WorkoutEntry | FoodEntry)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'today') {
        const [workouts, food] = await Promise.all([
          StorageService.getWorkoutHistory(),
          StorageService.getFoodEntries()
        ]);

        const today = new Date();
        const todayStart = startOfDay(today);
        const todayEnd = endOfDay(today);

        setTodayWorkouts(workouts.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= todayStart && entryDate <= todayEnd;
        }));

        setTodayFood(food.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= todayStart && entryDate <= todayEnd;
        }));
      } else {
        const [workouts, food] = await Promise.all([
          StorageService.getWorkoutHistory(),
          StorageService.getFoodEntries()
        ]);

        const allEntries = [...workouts, ...food].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        setHistory(allEntries);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTodayStats = () => (
    <View style={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Workouts</Text>
        {todayWorkouts.length === 0 ? (
          <Text style={styles.emptyText}>No workouts today</Text>
        ) : (
          todayWorkouts.map(workout => (
            <View key={workout.date} style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="barbell-outline" size={24} color="#1E4D6B" />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{workout.name}</Text>
                  <Text style={styles.cardSubtitle}>
                    {format(new Date(workout.date), 'h:mm a')} • {workout.duration} min
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Food</Text>
        {todayFood.length === 0 ? (
          <Text style={styles.emptyText}>No food entries today</Text>
        ) : (
          todayFood.map(food => (
            <View key={food.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="restaurant-outline" size={24} color="#1E4D6B" />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{food.name}</Text>
                  <Text style={styles.cardSubtitle}>
                    {format(new Date(food.date), 'h:mm a')}
                  </Text>
                </View>
              </View>
              <View style={styles.cardDetails}>
                <Text style={styles.cardDetail}>Calories: {food.calories}</Text>
                <Text style={styles.cardDetail}>Protein: {food.protein}g</Text>
                <Text style={styles.cardDetail}>Carbs: {food.carbs}g</Text>
                <Text style={styles.cardDetail}>Fat: {food.fat}g</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );

  const renderHistory = () => (
    <ScrollView style={styles.content}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      ) : history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No history yet</Text>
        </View>
      ) : (
        history.map(entry => {
          const isWorkout = 'duration' in entry;
          return (
            <View key={`${isWorkout ? 'workout' : 'food'}-${entry.date}`} style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons 
                  name={isWorkout ? 'barbell-outline' : 'restaurant-outline'} 
                  size={24} 
                  color="#1E4D6B" 
                />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>
                    {isWorkout ? entry.name : (entry as FoodEntry).name}
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    {format(new Date(entry.date), 'MMM d, yyyy h:mm a')}
                  </Text>
                </View>
              </View>
              {isWorkout ? (
                <View style={styles.cardDetails}>
                  <Text style={styles.cardDetail}>Duration: {entry.duration} min</Text>
                  <Text style={styles.cardDetail}>Calories: {entry.calories}</Text>
                </View>
              ) : (
                <View style={styles.cardDetails}>
                  <Text style={styles.cardDetail}>Calories: {(entry as FoodEntry).calories}</Text>
                  <Text style={styles.cardDetail}>Protein: {(entry as FoodEntry).protein}g</Text>
                  <Text style={styles.cardDetail}>Carbs: {(entry as FoodEntry).carbs}g</Text>
                  <Text style={styles.cardDetail}>Fat: {(entry as FoodEntry).fat}g</Text>
                </View>
              )}
            </View>
          );
        })
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'today' && styles.activeTab]}
          onPress={() => setActiveTab('today')}
        >
          <Text style={[styles.tabText, activeTab === 'today' && styles.activeTabText]}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>History</Text>
        </TouchableOpacity>
      </View>
      {activeTab === 'today' ? renderTodayStats() : renderHistory()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#1E4D6B',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#829AAF',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E4D6B',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E4D6B',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#829AAF',
  },
  cardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardDetail: {
    fontSize: 14,
    color: '#4B5563',
    marginRight: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#829AAF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#829AAF',
  },
});

export default StatsScreen; 