import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { ActiveWorkout } from '../types/workout';
import { Ionicons } from '@expo/vector-icons';

interface WorkoutCompletionScreenProps {
  workout: ActiveWorkout;
  onFinish: () => void;
}

const WorkoutCompletionScreen = ({ workout, onFinish }: WorkoutCompletionScreenProps) => {
  const calculateStats = () => {
    let totalWeight = 0;
    let totalReps = 0;
    let bestWeight = 0;
    let bestReps = 0;
    let totalSets = 0;
    let completedSets = 0;
    let failedSets = 0;

    workout.exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        if (set.completed) {
          totalWeight += (set.actualWeight || 0) * (set.actualReps || 0);
          totalReps += set.actualReps || 0;
          totalSets++;
          completedSets++;

          // Track best weight and reps
          if (set.actualWeight && set.actualWeight > bestWeight) {
            bestWeight = set.actualWeight;
          }
          if (set.actualReps && set.actualReps > bestReps) {
            bestReps = set.actualReps;
          }
        }
        if (set.isFailure) {
          failedSets++;
        }
      });
    });

    return {
      totalWeight,
      totalReps,
      bestWeight,
      bestReps,
      totalSets,
      completedSets,
      failedSets,
      completionRate: totalSets > 0 ? (completedSets / totalSets) * 100 : 0,
    };
  };

  const stats = calculateStats();
  const duration = workout.endTime instanceof Date
    ? Math.round((workout.endTime.getTime() - workout.startTime.getTime()) / 1000 / 60)
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="checkmark-circle" size={64} color="#739E82" />
        <Text style={styles.title}>Workout Complete!</Text>
        <Text style={styles.subtitle}>Great job! Here's your summary</Text>
      </View>

      <ScrollView style={styles.statsContainer}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalWeight}kg</Text>
            <Text style={styles.statLabel}>Total Weight Lifted</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalReps}</Text>
            <Text style={styles.statLabel}>Total Reps</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.bestWeight}kg</Text>
            <Text style={styles.statLabel}>Best Weight</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.bestReps}</Text>
            <Text style={styles.statLabel}>Best Reps</Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Workout Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration:</Text>
            <Text style={styles.detailValue}>{duration} minutes</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Sets Completed:</Text>
            <Text style={styles.detailValue}>{stats.completedSets}/{stats.totalSets}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Failed Sets:</Text>
            <Text style={styles.detailValue}>{stats.failedSets}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Completion Rate:</Text>
            <Text style={styles.detailValue}>{stats.completionRate.toFixed(1)}%</Text>
          </View>
        </View>

        <View style={styles.exercisesCard}>
          <Text style={styles.exercisesTitle}>Exercise Summary</Text>
          {workout.exercises.map((exercise, index) => {
            const exerciseStats = exercise.sets.reduce((acc, set) => {
              if (set.completed) {
                acc.totalWeight += (set.actualWeight || 0) * (set.actualReps || 0);
                acc.totalReps += set.actualReps || 0;
                acc.completedSets++;
              }
              return acc;
            }, { totalWeight: 0, totalReps: 0, completedSets: 0 });

            return (
              <View key={index} style={styles.exerciseSummary}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <View style={styles.exerciseStats}>
                  <Text style={styles.exerciseStat}>
                    {exerciseStats.completedSets}/{exercise.sets.length} sets
                  </Text>
                  <Text style={styles.exerciseStat}>
                    {exerciseStats.totalWeight}kg total
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.finishButton} onPress={onFinish}>
        <Text style={styles.finishButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  header: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3D4F',
    marginTop: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  subtitle: {
    fontSize: 16,
    color: '#829AAF',
    marginTop: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  statsContainer: {
    flex: 1,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#2C3D4F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3D4F',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  statLabel: {
    fontSize: 14,
    color: '#829AAF',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  detailsCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#2C3D4F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3D4F',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: '#829AAF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  detailValue: {
    fontSize: 16,
    color: '#2C3D4F',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  exercisesCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#2C3D4F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  exercisesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3D4F',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  exerciseSummary: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F0',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3D4F',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  exerciseStats: {
    flexDirection: 'row',
    gap: 16,
  },
  exerciseStat: {
    fontSize: 14,
    color: '#829AAF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  finishButton: {
    backgroundColor: '#1E4D6B',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});

export default WorkoutCompletionScreen; 