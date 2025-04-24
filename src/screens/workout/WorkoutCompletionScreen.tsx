import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../../services/storage';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActiveWorkout } from '../../types/workout';
import { WorkoutStackParamList } from '../../navigation/WorkoutStack';

type WorkoutScreenNavigationProp = NativeStackNavigationProp<WorkoutStackParamList>;

const WorkoutCompletionScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<WorkoutScreenNavigationProp>();
  const { workoutId } = route.params as { workoutId: string };
  const [workout, setWorkout] = useState<ActiveWorkout | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorkout = async () => {
    try {
      // First try to get from completed workouts
      const completedWorkouts = await StorageService.getCompletedWorkouts();
      let foundWorkout = completedWorkouts.find(w => w.id === workoutId);
      
      if (!foundWorkout) {
        // If not found in completed, try active workouts
        const activeWorkout = await StorageService.getActiveWorkout();
        if (activeWorkout && activeWorkout.id === workoutId) {
          foundWorkout = activeWorkout;
        }
      }

      if (foundWorkout) {
        // Convert string dates back to Date objects
        foundWorkout.startTime = new Date(foundWorkout.startTime);
        if (foundWorkout.endTime) {
          foundWorkout.endTime = new Date(foundWorkout.endTime);
        }
        setWorkout(foundWorkout);
      } else {
        Alert.alert('Error', 'Workout not found');
        navigation.navigate('WorkoutHome');
      }
    } catch (error) {
      console.error('Error fetching workout:', error);
      Alert.alert('Error', 'Failed to fetch workout details');
      navigation.navigate('WorkoutHome');
    } finally {
      setIsLoading(false);
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
    fetchWorkout();
  }, [workoutId]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E4D6B" />
          <Text style={styles.loadingText}>Loading workout summary...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!workout) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Workout not found</Text>
          <TouchableOpacity 
            style={styles.doneButton}
            onPress={() => navigation.navigate('WorkoutHome')}
          >
            <Text style={styles.doneButtonText}>Go to Workouts</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const duration = Math.floor(
    (new Date(workout.endTime || new Date()).getTime() - new Date(workout.startTime).getTime()) / 1000
  );

  const completedSets = workout.exercises.reduce(
    (total, exercise) => total + exercise.sets.filter(set => set.completed).length,
    0
  );

  const totalSets = workout.exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Workout Complete!</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={24} color="#E74C3C" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{Math.floor(duration / 60)}m {duration % 60}s</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{completedSets}/{totalSets}</Text>
            <Text style={styles.statLabel}>Sets Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{workout.exercises.length}</Text>
            <Text style={styles.statLabel}>Exercises</Text>
          </View>
        </View>

        <View style={styles.exercisesContainer}>
          {workout.exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseCard}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              {exercise.sets.map((set, setIndex) => (
                <View key={setIndex} style={styles.setRow}>
                  <Text style={styles.setNumber}>Set {setIndex + 1}</Text>
                  <Text style={styles.setDetails}>
                    {set.actualWeight ? `${set.actualWeight}kg` : '-'} × {set.actualReps || '-'}
                  </Text>
                  <View style={styles.setStatus}>
                    {set.completed && <Ionicons name="checkmark-circle" size={20} color="#2ECC71" />}
                    {set.isFailure && <Ionicons name="close-circle" size={20} color="#E74C3C" />}
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.doneButton}
          onPress={() => navigation.navigate('WorkoutHome')}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 16,
  },
  backButtonText: {
    color: '#1E4D6B',
    fontSize: 16,
  },
  backButton: {
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
  },
  deleteButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
  },
  statLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
  },
  exercisesContainer: {
    padding: 16,
  },
  exerciseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
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
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  setNumber: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  setDetails: {
    fontSize: 16,
    color: '#2C3E50',
  },
  setStatus: {
    width: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 16,
  },
  doneButton: {
    backgroundColor: '#1E4D6B',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WorkoutCompletionScreen; 