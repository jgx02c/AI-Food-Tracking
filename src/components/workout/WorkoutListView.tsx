import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ActiveWorkout } from '../../types/workout';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

interface WorkoutListViewProps {
  groupedWorkouts: {
    today: ActiveWorkout[];
    yesterday: ActiveWorkout[];
    thisWeek: ActiveWorkout[];
    lastWeek: ActiveWorkout[];
    older: ActiveWorkout[];
  };
}

const WorkoutListView = ({ groupedWorkouts }: WorkoutListViewProps) => {
  const navigation = useNavigation();

  const renderWorkoutEntry = (workout: ActiveWorkout) => {
    if (!workout || !workout.template) {
      console.warn('Invalid workout data:', workout);
      return null;
    }

    return (
      <TouchableOpacity 
        key={workout.id} 
        style={styles.workoutCard}
        onPress={() => navigation.navigate('WorkoutDetails', { workoutId: workout.id })}
      >
        <View style={styles.workoutHeader}>
          <View style={styles.workoutIcon}>
            <Ionicons name="barbell-outline" size={24} color="#1E4D6B" />
          </View>
          <View style={styles.workoutInfo}>
            <Text style={styles.workoutTitle}>{workout.template.name || 'Unnamed Workout'}</Text>
            <Text style={styles.workoutTime}>
              {format(new Date(workout.startTime), 'h:mm a')}
            </Text>
          </View>
        </View>
        <View style={styles.workoutDetails}>
          <Text style={styles.detailText}>
            {workout.exercises.length} exercises
          </Text>
          <Text style={styles.detailText}>
            {workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)} sets
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = (title: string, workouts: ActiveWorkout[]) => {
    if (workouts.length === 0) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {workouts.map(renderWorkoutEntry)}
      </View>
    );
  };

  return (
    <ScrollView style={styles.content}>
      {groupedWorkouts.today.length === 0 && 
       groupedWorkouts.yesterday.length === 0 && 
       groupedWorkouts.thisWeek.length === 0 && 
       groupedWorkouts.lastWeek.length === 0 && 
       groupedWorkouts.older.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="barbell-outline" size={48} color="#D9D9D9" />
          <Text style={styles.emptyStateText}>No completed workouts yet</Text>
        </View>
      ) : (
        <>
          {renderSection('Today', groupedWorkouts.today)}
          {renderSection('Yesterday', groupedWorkouts.yesterday)}
          {renderSection('This Week', groupedWorkouts.thisWeek)}
          {renderSection('Last Week', groupedWorkouts.lastWeek)}
          {renderSection('Older', groupedWorkouts.older)}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7F8C8D',
    marginBottom: 12,
    paddingLeft: 4,
  },
  workoutCard: {
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
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  workoutTime: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 2,
  },
  workoutDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#2C3E50',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 8,
  },
});

export default WorkoutListView; 