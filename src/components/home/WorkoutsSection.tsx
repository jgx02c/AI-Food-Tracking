import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutEntry } from '../../types/workout';

interface WorkoutsSectionProps {
  workouts: WorkoutEntry[];
  onWorkoutPress: (workoutId: string) => void;
}

const WorkoutsSection = ({ workouts, onWorkoutPress }: WorkoutsSectionProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Today's Workouts</Text>
      {workouts.length === 0 ? (
        <Text style={styles.emptyText}>No workouts today</Text>
      ) : (
        workouts.map(workout => (
          <TouchableOpacity 
            key={workout.date} 
            style={styles.workoutCard}
            onPress={() => onWorkoutPress(workout.date)}
          >
            <View style={styles.workoutHeader}>
              <Ionicons name="barbell-outline" size={24} color="#2C3E50" />
              <Text style={styles.workoutTitle}>{workout.name}</Text>
              <Ionicons name="chevron-forward" size={20} color="#7F8C8D" style={styles.chevron} />
            </View>
            <Text style={styles.workoutDuration}>
              Duration: {workout.duration} minutes
            </Text>
            <Text style={styles.workoutCalories}>
              Calories: {workout.calories}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
  workoutCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 8,
  },
  workoutDuration: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  workoutCalories: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  chevron: {
    marginLeft: 'auto',
  },
  emptyText: {
    textAlign: 'center',
    color: '#7F8C8D',
    fontSize: 16,
  },
});

export default WorkoutsSection; 