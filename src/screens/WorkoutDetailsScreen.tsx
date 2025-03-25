import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../services/storage';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

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

const WorkoutDetailsScreen = () => {
  const route = useRoute();
  const { workoutId } = route.params as { workoutId: string };
  const [workout, setWorkout] = useState<WorkoutSession | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWorkout = async () => {
    try {
      const allWorkouts = await StorageService.getWorkoutSessions();
      const foundWorkout = allWorkouts.find(w => w.id === workoutId);
      if (foundWorkout) {
        setWorkout(foundWorkout);
      } else {
        Alert.alert('Error', 'Workout not found');
      }
    } catch (error) {
      console.error('Error fetching workout:', error);
      Alert.alert('Error', 'Failed to fetch workout details');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWorkout();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchWorkout();
  }, [workoutId]);

  if (!workout) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading workout details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalSets = workout.exercises.reduce((acc, exercise) => acc + exercise.sets.length, 0);
  const completedSets = workout.exercises.reduce(
    (acc, exercise) => acc + exercise.sets.filter(set => set.completed).length,
    0
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Workout Details</Text>
          <Text style={styles.date}>{new Date(workout.date).toLocaleDateString()}</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Ionicons name="time-outline" size={24} color="#2C3E50" />
            <Text style={styles.summaryLabel}>Duration</Text>
            <Text style={styles.summaryValue}>{Math.round(workout.duration / 60)} minutes</Text>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="barbell-outline" size={24} color="#2C3E50" />
            <Text style={styles.summaryLabel}>Exercises</Text>
            <Text style={styles.summaryValue}>{workout.exercises.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#2C3E50" />
            <Text style={styles.summaryLabel}>Sets Completed</Text>
            <Text style={styles.summaryValue}>{completedSets}/{totalSets}</Text>
          </View>
        </View>

        <View style={styles.exercisesContainer}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          {workout.exercises.map(exercise => (
            <View key={exercise.id} style={styles.exerciseCard}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <View style={styles.setsContainer}>
                {exercise.sets.map((set, index) => (
                  <View key={index} style={styles.setItem}>
                    <Text style={styles.setNumber}>Set {index + 1}</Text>
                    <Text style={styles.setDetails}>
                      {set.reps} reps
                      {set.weight ? ` @ ${set.weight}kg` : ''}
                    </Text>
                    <View style={[styles.completionIndicator, set.completed && styles.completedSet]}>
                      {set.completed && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#7F8C8D',
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
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 4,
  },
  exercisesContainer: {
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
  exerciseCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  setsContainer: {
    gap: 8,
  },
  setItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 8,
  },
  setNumber: {
    fontSize: 14,
    color: '#7F8C8D',
    width: 60,
  },
  setDetails: {
    flex: 1,
    fontSize: 14,
    color: '#2C3E50',
  },
  completionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedSet: {
    backgroundColor: '#739E82',
  },
});

export default WorkoutDetailsScreen; 