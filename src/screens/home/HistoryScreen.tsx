import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../../services/storage';
import { FoodEntry } from '../../services/storage';
import { WorkoutEntry, ActiveWorkout } from '../../types/workout';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HistoryScreen = () => {
  const [entries, setEntries] = useState<(WorkoutEntry | FoodEntry)[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const [workouts, foodEntries] = await Promise.all([
        StorageService.getWorkoutHistory(),
        StorageService.getFoodHistory()
      ]);

      // Combine and sort entries by date
      const allEntries = [...workouts, ...foodEntries].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      setEntries(allEntries);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkoutPress = async (entry: WorkoutEntry) => {
    try {
      const completedWorkouts = await StorageService.getCompletedWorkouts();
      const workout = completedWorkouts.find(w => 
        w.startTime.toISOString() === entry.date
      );
      
      if (workout) {
        navigation.navigate('WorkoutDetails', { workoutId: workout.id });
      }
    } catch (error) {
      console.error('Error loading workout details:', error);
    }
  };

  const renderEntry = (entry: WorkoutEntry | FoodEntry) => {
    const date = new Date(entry.date);
    const isWorkout = 'type' in entry;

    return (
      <TouchableOpacity 
        key={`${isWorkout ? 'workout' : 'food'}-${entry.date}`}
        style={styles.entryCard}
        onPress={() => isWorkout && handleWorkoutPress(entry as WorkoutEntry)}
      >
        <View style={styles.entryHeader}>
          <View style={styles.entryIcon}>
            <Ionicons 
              name={isWorkout ? 'barbell-outline' : 'restaurant-outline'} 
              size={24} 
              color="#1E4D6B" 
            />
          </View>
          <View style={styles.entryInfo}>
            <Text style={styles.entryTitle}>
              {isWorkout ? entry.name : entry.name}
            </Text>
            <Text style={styles.entryDate}>
              {format(date, 'MMM d, yyyy h:mm a')}
            </Text>
          </View>
        </View>
        {isWorkout ? (
          <View style={styles.workoutDetails}>
            <Text style={styles.detailText}>Duration: {entry.duration} minutes</Text>
          </View>
        ) : (
          <View style={styles.foodDetails}>
            <Text style={styles.detailText}>Calories: {entry.calories}</Text>
            <Text style={styles.detailText}>Protein: {entry.protein}g</Text>
            <Text style={styles.detailText}>Carbs: {entry.carbs}g</Text>
            <Text style={styles.detailText}>Fat: {entry.fat}g</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
      </View>
      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading history...</Text>
          </View>
        ) : entries.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No history yet</Text>
          </View>
        ) : (
          entries.map(renderEntry)
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E4D6B',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  entryCard: {
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
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  entryInfo: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E4D6B',
    marginBottom: 4,
  },
  entryDate: {
    fontSize: 14,
    color: '#829AAF',
  },
  workoutDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  foodDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailText: {
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

export default HistoryScreen; 