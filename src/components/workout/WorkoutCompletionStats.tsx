import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActiveWorkout } from '../../types/workout';

type Props = {
  workout: ActiveWorkout;
};

const WorkoutCompletionStats = ({ workout }: Props) => {
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
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#7F8C8D',
  },
});

export default WorkoutCompletionStats; 