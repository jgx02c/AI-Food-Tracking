import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActiveWorkout } from '../../types/workout';

interface WorkoutCardProps {
  workout: ActiveWorkout;
}

const WorkoutCard = ({ workout }: WorkoutCardProps) => {
  const duration = workout.endTime 
    ? Math.round((workout.endTime.getTime() - workout.startTime.getTime()) / 1000 / 60)
    : 0;

  return (
    <View style={styles.workoutCard}>
      <Text style={styles.workoutName}>
        {workout.exercises.length} exercises
      </Text>
      <View style={styles.workoutDetails}>
        <Text style={styles.workoutDetail}>
          {new Date(workout.startTime).toLocaleTimeString()}
        </Text>
        <Text style={styles.workoutDetail}>
          {duration} min
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  workoutCard: {
    backgroundColor: '#F5F5F0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3D4F',
    marginBottom: 4,
  },
  workoutDetails: {
    flexDirection: 'row',
    gap: 8,
  },
  workoutDetail: {
    fontSize: 14,
    color: '#829AAF',
  },
});

export default WorkoutCard; 