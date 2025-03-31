import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { ActiveWorkout } from '../../types/workout';
import WorkoutHeader from './WorkoutHeader';
import ExerciseCard from './ExerciseCard';

interface ActiveWorkoutViewProps {
  workout: ActiveWorkout;
  isTimerPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onUpdateSetWeight: (exerciseIndex: number, setIndex: number, weight: number) => void;
  onUpdateSetReps: (exerciseIndex: number, setIndex: number, reps: number) => void;
  onCompleteSet: (exerciseIndex: number, setIndex: number) => void;
  onMarkSetAsFailure: (exerciseIndex: number, setIndex: number) => void;
  onDeleteSet: (exerciseIndex: number, setIndex: number) => void;
  onAddSet: (exerciseIndex: number) => void;
  onFinish: () => void;
}

const ActiveWorkoutView = ({
  workout,
  isTimerPaused,
  onPause,
  onResume,
  onStop,
  onUpdateSetWeight,
  onUpdateSetReps,
  onCompleteSet,
  onMarkSetAsFailure,
  onDeleteSet,
  onAddSet,
  onFinish,
}: ActiveWorkoutViewProps) => {
  return (
    <>
      <WorkoutHeader
        onPause={onPause}
        onResume={onResume}
        onStop={onStop}
        isPaused={isTimerPaused}
      />
      <ScrollView style={styles.exercisesContainer}>
        {workout.exercises.map((exercise, exerciseIndex) => (
          <ExerciseCard
            key={exercise.exerciseId}
            exercise={exercise}
            exerciseIndex={exerciseIndex}
            onUpdateSetWeight={onUpdateSetWeight}
            onUpdateSetReps={onUpdateSetReps}
            onCompleteSet={onCompleteSet}
            onMarkSetAsFailure={onMarkSetAsFailure}
            onDeleteSet={onDeleteSet}
            onAddSet={onAddSet}
          />
        ))}
      </ScrollView>
      <View style={styles.workoutFooter}>
        <TouchableOpacity
          style={styles.finishButton}
          onPress={onFinish}
        >
          <Text style={styles.finishButtonText}>Finish Workout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});

export default ActiveWorkoutView; 