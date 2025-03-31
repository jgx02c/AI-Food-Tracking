import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../services/storage';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ActiveWorkout } from '../types/workout';

const WorkoutDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { workoutId } = route.params as { workoutId: string };
  const [workout, setWorkout] = useState<ActiveWorkout | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  console.log('WorkoutDetailsScreen mounted with ID:', workoutId);

  const fetchWorkout = async () => {
    try {
      console.log('Fetching workout with ID:', workoutId);
      const allWorkouts = await StorageService.getCompletedWorkouts();
      console.log('All workouts:', allWorkouts);
      const foundWorkout = allWorkouts.find(w => w.id === workoutId);
      console.log('Found workout:', foundWorkout);
      
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

  const handleDelete = async () => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.deleteWorkout(workoutId);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting workout:', error);
              Alert.alert('Error', 'Failed to delete workout');
            }
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWorkout();
    setRefreshing(false);
  };

  useEffect(() => {
    console.log('useEffect triggered with workoutId:', workoutId);
    fetchWorkout();
  }, [workoutId]);

  if (!workout) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading workout details...</Text>
        </View>
      </View>
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
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.date}>{new Date(workout.startTime).toLocaleDateString()}</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Ionicons name="time-outline" size={24} color="#2C3E50" />
            <Text style={styles.summaryLabel}>Duration</Text>
            <Text style={styles.summaryValue}>
              {Math.round((new Date(workout.endTime || new Date()).getTime() - new Date(workout.startTime).getTime()) / 60000)} minutes
            </Text>
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
            <View key={exercise.exerciseId} style={styles.exerciseCard}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <View style={styles.setsContainer}>
                {exercise.sets.map((set, index) => (
                  <View key={index} style={styles.setItem}>
                    <Text style={styles.setNumber}>Set {index + 1}</Text>
                    <Text style={styles.setDetails}>
                      {set.actualReps || set.reps} reps
                      {set.actualWeight ? ` @ ${set.actualWeight}kg` : ''}
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
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
        <Text style={styles.deleteButtonText}>Delete Workout</Text>
      </TouchableOpacity>
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
    backgroundColor: '#F5F5F0',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  header: {
    marginBottom: 20,
  },
  date: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 12,
    flex: 1,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  exercisesContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  exerciseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  setsContainer: {
    gap: 8,
  },
  setItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  setNumber: {
    fontSize: 14,
    color: '#2C3E50',
    width: 60,
  },
  setDetails: {
    fontSize: 14,
    color: '#2C3E50',
    flex: 1,
  },
  completionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedSet: {
    backgroundColor: '#2ECC71',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default WorkoutDetailsScreen;