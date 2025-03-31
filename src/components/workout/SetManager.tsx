import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ActiveWorkout } from '../../types/workout';

interface SetManagerProps {
  activeWorkout: ActiveWorkout | null;
  onUpdateWorkout: (updatedWorkout: ActiveWorkout) => Promise<void>;
}

const SetManager: React.FC<SetManagerProps> = ({ activeWorkout, onUpdateWorkout }) => {
  const updateSetWeight = async (exerciseIndex: number, setIndex: number, weight: number) => {
    if (!activeWorkout) return;

    const updatedExercises = [...activeWorkout.exercises];
    updatedExercises[exerciseIndex].sets[setIndex].actualWeight = weight;

    const updatedWorkout = {
      ...activeWorkout,
      exercises: updatedExercises,
    };
    await onUpdateWorkout(updatedWorkout);
  };

  const updateSetReps = async (exerciseIndex: number, setIndex: number, reps: number) => {
    if (!activeWorkout) return;

    const updatedExercises = [...activeWorkout.exercises];
    updatedExercises[exerciseIndex].sets[setIndex].actualReps = reps;

    const updatedWorkout = {
      ...activeWorkout,
      exercises: updatedExercises,
    };
    await onUpdateWorkout(updatedWorkout);
  };

  const completeSet = async (exerciseIndex: number, setIndex: number) => {
    if (!activeWorkout) return;

    const updatedExercises = [...activeWorkout.exercises];
    const set = updatedExercises[exerciseIndex].sets[setIndex];
    
    // Toggle completion state
    set.completed = !set.completed;
    
    // If uncompleting, also clear failure state
    if (!set.completed) {
      set.isFailure = false;
    }

    const updatedWorkout = {
      ...activeWorkout,
      exercises: updatedExercises,
    };
    await onUpdateWorkout(updatedWorkout);
  };

  const markSetAsFailure = async (exerciseIndex: number, setIndex: number) => {
    if (!activeWorkout) return;

    const updatedExercises = [...activeWorkout.exercises];
    const set = updatedExercises[exerciseIndex].sets[setIndex];
    
    // Toggle failure state
    set.isFailure = !set.isFailure;
    
    // If marking as failure, also clear completion state
    if (set.isFailure) {
      set.completed = false;
    }

    const updatedWorkout = {
      ...activeWorkout,
      exercises: updatedExercises,
    };
    await onUpdateWorkout(updatedWorkout);
  };

  const deleteSet = async (exerciseIndex: number, setIndex: number) => {
    if (!activeWorkout) return;

    Alert.alert(
      'Delete Set',
      'Are you sure you want to delete this set?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedExercises = [...activeWorkout.exercises];
            updatedExercises[exerciseIndex].sets.splice(setIndex, 1);

            const updatedWorkout = {
              ...activeWorkout,
              exercises: updatedExercises,
            };
            await onUpdateWorkout(updatedWorkout);
          },
        },
      ]
    );
  };

  const addSet = async (exerciseIndex: number) => {
    if (!activeWorkout) return;

    const updatedExercises = [...activeWorkout.exercises];
    const exercise = updatedExercises[exerciseIndex];
    const lastSet = exercise.sets[exercise.sets.length - 1];

    // Create a new set based on the last set's configuration
    const newSet = {
      reps: lastSet.reps,
      weight: lastSet.weight,
      actualWeight: undefined,
      actualReps: undefined,
      completed: false,
      isFailure: false,
    };

    exercise.sets.push(newSet);

    const updatedWorkout = {
      ...activeWorkout,
      exercises: updatedExercises,
    };
    await onUpdateWorkout(updatedWorkout);
  };

  return null; // This is a logic-only component, no UI
};

export default SetManager; 