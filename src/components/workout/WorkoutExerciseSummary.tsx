import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CompletedExercise } from '../../types/workout';

interface WorkoutExerciseSummaryProps {
  exercises: CompletedExercise[];
}

const WorkoutExerciseSummary: React.FC<WorkoutExerciseSummaryProps> = ({ exercises }) => {
  return (
    <View style={styles.exercisesContainer}>
      {exercises.map((exercise, index) => (
        <View key={index} style={styles.exerciseCard}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          {exercise.sets.map((set, setIndex) => (
            <View key={setIndex} style={styles.setRow}>
              <Text style={styles.setNumber}>Set {setIndex + 1}</Text>
              <Text style={styles.setDetails}>
                {set.actualWeight ? `${set.actualWeight}kg` : '-'} × {set.actualReps || '-'}
              </Text>
              <View style={styles.setStatus}>
                {set.completed && <Ionicons name="checkmark-circle" size={20} color="#2ECC71" />}
                {set.isFailure && <Ionicons name="close-circle" size={20} color="#E74C3C" />}
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  exercisesContainer: {
    padding: 16,
  },
  exerciseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  setNumber: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  setDetails: {
    fontSize: 16,
    color: '#2C3E50',
  },
  setStatus: {
    width: 24,
    alignItems: 'center',
  },
});

export default WorkoutExerciseSummary; 