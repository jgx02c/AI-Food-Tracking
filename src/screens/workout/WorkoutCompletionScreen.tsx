import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../../services/storage';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActiveWorkout } from '../../types/workout';
import { WorkoutStackParamList } from '../../navigation/WorkoutStack';
import WorkoutCompletionStats from '../../components/workout/WorkoutCompletionStats';
import WorkoutExerciseSummary from '../../components/workout/WorkoutExerciseSummary';

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
      setIsLoading(true);
      const completedWorkouts = await StorageService.getCompletedWorkouts();
      const foundWorkout = completedWorkouts.find(w => w.id === workoutId);

      if (foundWorkout) {
        // Convert string dates back to Date objects
        foundWorkout.startTime = new Date(foundWorkout.startTime);
        if (foundWorkout.endTime) {
          foundWorkout.endTime = new Date(foundWorkout.endTime);
        }
        setWorkout(foundWorkout);
      } else {
        console.error('Workout not found:', workoutId);
        Alert.alert(
          'Error',
          'Workout not found. Please try again.',
          [
            {
              text: 'OK',
              onPress: () => navigation.replace('WorkoutHome')
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error fetching workout:', error);
      Alert.alert(
        'Error',
        'Failed to load workout details. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('WorkoutHome')
          }
        ]
      );
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
              navigation.replace('WorkoutHome');
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
            onPress={() => navigation.replace('WorkoutHome')}
          >
            <Text style={styles.doneButtonText}>Go to Workouts</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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

        <WorkoutCompletionStats workout={workout} />
        <WorkoutExerciseSummary exercises={workout.exercises} />

        <TouchableOpacity 
          style={styles.doneButton}
          onPress={() => navigation.replace('WorkoutHome')}
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7F8C8D',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  deleteButton: {
    padding: 8,
  },
  doneButton: {
    backgroundColor: '#2ECC71',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WorkoutCompletionScreen; 