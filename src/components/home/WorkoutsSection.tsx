import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutEntry, ActiveWorkout } from '../../types/workout';

interface WorkoutsSectionProps {
  todayWorkouts: WorkoutEntry[];
  completedWorkouts: ActiveWorkout[];
  onPress: () => void;
}

const WorkoutsSection = ({ todayWorkouts, completedWorkouts, onPress }: WorkoutsSectionProps) => {
  return (
    <TouchableOpacity 
      style={styles.content}
      onPress={onPress}
    >
      {todayWorkouts.length === 0 ? (
        <Text style={styles.emptyText}>No workouts planned for today</Text>
      ) : (
        <>
          {todayWorkouts.slice(0, 3).map(workout => (
            <View key={workout.date} style={styles.workoutCard}>
              <View style={styles.workoutHeader}>
                <View style={styles.workoutTitleContainer}>
                  <Ionicons name="fitness-outline" size={20} color="#2C3E50" />
                  <Text style={styles.workoutName}>{workout.name}</Text>
                </View>
              </View>
              <View style={styles.spacer} />
              <View style={styles.workoutDetails}>
                <Text style={styles.workoutDuration}>{workout.duration} min</Text>
                <Text style={styles.workoutCalories}>{workout.calories} cal</Text>
                <Text style={styles.workoutWeight}>{workout.totalWeight} kg</Text>
              </View>
            </View>
          ))}
          {todayWorkouts.length > 3 && (
            <Text style={styles.viewMoreText}>
              View {todayWorkouts.length - 3} more workouts
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 0,
  },
  emptyText: {
    fontSize: 14,
    color: '#7F8C8D',
    fontStyle: 'italic',
  },
  workoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 8,
  },
  spacer: {
    height: 6,
    backgroundColor: '#F8F9FA',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  workoutDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutDuration: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  workoutCalories: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  workoutWeight: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  viewMoreText: {
    fontSize: 12,
    color: '#1E4D6B',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default WorkoutsSection; 