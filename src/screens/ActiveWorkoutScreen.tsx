import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActiveWorkout } from '../types/workout';
import { StorageService } from '../services/storage';
import WorkoutHeader from '../components/workout/WorkoutHeader';
import ExerciseCard from '../components/workout/ExerciseCard';
import { WorkoutStackParamList } from '../navigation/WorkoutStack';

type WorkoutScreenNavigationProp = NativeStackNavigationProp<WorkoutStackParamList>;

const ActiveWorkoutScreen = () => {
  const navigation = useNavigation<WorkoutScreenNavigationProp>();
  const [workout, setWorkout] = useState<ActiveWorkout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    loadActiveWorkout();
    const timer = setInterval(() => {
      if (!isTimerPaused && workout) {
        setElapsedTime(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerPaused, workout]);

  const loadActiveWorkout = async () => {
    try {
      const activeWorkout = await StorageService.getActiveWorkout();
      if (activeWorkout) {
        setWorkout(activeWorkout);
      }
    } catch (error) {
      console.error('Error loading active workout:', error);
      setWorkout(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateWorkout = async (updatedWorkout: ActiveWorkout) => {
    try {
      await StorageService.saveActiveWorkout(updatedWorkout);
      setWorkout(updatedWorkout);
    } catch (error) {
      console.error('Error updating workout:', error);
    }
  };

  const handleFinishWorkout = async () => {
    try {
      if (workout) {
        const completedWorkout: ActiveWorkout = {
          ...workout,
          endTime: new Date(),
          status: 'completed' as const,
        };
        
        // Save the completed workout
        await StorageService.saveCompletedWorkout(completedWorkout);
        
        // Clear the active workout
        await StorageService.clearActiveWorkout();
        setWorkout(null);
        
        // Navigate to completion screen
        navigation.navigate('WorkoutCompletion', { workoutId: completedWorkout.id });
      }
    } catch (error) {
      console.error('Error finishing workout:', error);
    }
  };

  const handleCancelWorkout = async () => {
    try {
      await StorageService.clearActiveWorkout();
      setWorkout(null);
      navigation.goBack();
    } catch (error) {
      console.error('Error canceling workout:', error);
    }
  };

  const handleUpdateSetWeight = async (exerciseIndex: number, setIndex: number, weight: number) => {
    if (!workout) return;

    const updatedWorkout = { ...workout };
    updatedWorkout.exercises[exerciseIndex].sets[setIndex].actualWeight = weight;
    await handleUpdateWorkout(updatedWorkout);
  };

  const handleUpdateSetReps = async (exerciseIndex: number, setIndex: number, reps: number) => {
    if (!workout) return;

    const updatedWorkout = { ...workout };
    updatedWorkout.exercises[exerciseIndex].sets[setIndex].actualReps = reps;
    await handleUpdateWorkout(updatedWorkout);
  };

  const handleCompleteSet = async (exerciseIndex: number, setIndex: number) => {
    if (!workout) return;

    const updatedWorkout = { ...workout };
    updatedWorkout.exercises[exerciseIndex].sets[setIndex].completed = true;
    await handleUpdateWorkout(updatedWorkout);
  };

  const handleMarkSetAsFailure = async (exerciseIndex: number, setIndex: number) => {
    if (!workout) return;

    const updatedWorkout = { ...workout };
    const set = updatedWorkout.exercises[exerciseIndex].sets[setIndex];
    set.isFailure = !set.isFailure;
    if (set.isFailure) {
      set.completed = true;
    }
    await handleUpdateWorkout(updatedWorkout);
  };

  const handleDeleteSet = async (exerciseIndex: number, setIndex: number) => {
    if (!workout) return;

    const updatedWorkout = { ...workout };
    updatedWorkout.exercises[exerciseIndex].sets.splice(setIndex, 1);
    await handleUpdateWorkout(updatedWorkout);
  };

  const handleAddSet = async (exerciseIndex: number) => {
    if (!workout) return;

    const updatedWorkout = { ...workout };
    const exercise = updatedWorkout.exercises[exerciseIndex];
    const lastSet = exercise.sets[exercise.sets.length - 1];
    
    exercise.sets.push({
      ...lastSet,
      actualWeight: undefined,
      actualReps: undefined,
      completed: false,
      isFailure: false,
    });
    
    await handleUpdateWorkout(updatedWorkout);
  };

  useEffect(() => {
    if (!isLoading && !workout) {
      navigation.goBack();
    }
  }, [isLoading, workout, navigation]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E4D6B" />
        </View>
      </SafeAreaView>
    );
  }

  if (!workout) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <WorkoutHeader
        onPause={() => setIsTimerPaused(true)}
        onResume={() => setIsTimerPaused(false)}
        onStop={handleCancelWorkout}
        isPaused={isTimerPaused}
        elapsedTime={elapsedTime}
      />
      
      <ScrollView style={styles.exercisesContainer}>
        {workout.exercises.map((exercise, exerciseIndex) => (
          <ExerciseCard
            key={exercise.exerciseId}
            exercise={exercise}
            exerciseIndex={exerciseIndex}
            onUpdateSetWeight={handleUpdateSetWeight}
            onUpdateSetReps={handleUpdateSetReps}
            onCompleteSet={handleCompleteSet}
            onMarkSetAsFailure={handleMarkSetAsFailure}
            onDeleteSet={handleDeleteSet}
            onAddSet={handleAddSet}
          />
        ))}
      </ScrollView>

      <View style={styles.workoutFooter}>
        <TouchableOpacity
          style={styles.finishButton}
          onPress={handleFinishWorkout}
        >
          <Text style={styles.finishButtonText}>Finish Workout</Text>
        </TouchableOpacity>
      </View>
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
  exercisesContainer: {
    flex: 1,
    padding: 16,
  },
  workoutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F0',
  },
  finishButton: {
    backgroundColor: '#1E4D6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ActiveWorkoutScreen; 