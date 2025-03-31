import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Exercise, WorkoutExercise } from '../../types/workout';

interface ExerciseSelectorProps {
  selectedExercises: WorkoutExercise[];
  onAddExercise: (exercise: Exercise) => void;
  onRemoveExercise: (index: number) => void;
  onUpdateExerciseSet: (exerciseIndex: number, setIndex: number, field: 'reps' | 'weight' | 'restTime', value: number) => void;
  onAddSet: (exerciseIndex: number) => void;
  onRemoveSet: (exerciseIndex: number, setIndex: number) => void;
  onAddExercisePress: () => void;
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  selectedExercises,
  onAddExercise,
  onRemoveExercise,
  onUpdateExerciseSet,
  onAddSet,
  onRemoveSet,
  onAddExercisePress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Exercises</Text>
      {selectedExercises.map((exercise, exerciseIndex) => (
        <View key={exerciseIndex} style={styles.exerciseCard}>
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => onRemoveExercise(exerciseIndex)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.setsContainer}>
            <View style={styles.setsHeader}>
              <Text style={styles.setHeaderText}>Set</Text>
              <Text style={styles.setHeaderText}>Reps</Text>
              <Text style={styles.setHeaderText}>Weight</Text>
              <Text style={styles.setHeaderText}>Rest</Text>
            </View>
            {exercise.sets.map((set, setIndex) => (
              <View key={setIndex} style={styles.setRow}>
                <Text style={styles.setNumber}>{setIndex + 1}</Text>
                <TextInput
                  style={styles.setInput}
                  value={set.reps.toString()}
                  onChangeText={(value) => onUpdateExerciseSet(exerciseIndex, setIndex, 'reps', parseInt(value) || 0)}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.setInput}
                  value={set.weight?.toString() || ''}
                  onChangeText={(value) => onUpdateExerciseSet(exerciseIndex, setIndex, 'weight', parseInt(value) || 0)}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.setInput}
                  value={set.restTime.toString()}
                  onChangeText={(value) => onUpdateExerciseSet(exerciseIndex, setIndex, 'restTime', parseInt(value) || 0)}
                  keyboardType="numeric"
                />
              </View>
            ))}
            <TouchableOpacity
              style={styles.addSetButton}
              onPress={() => onAddSet(exerciseIndex)}
            >
              <Text style={styles.addSetButtonText}>+ Add Set</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <TouchableOpacity
        style={styles.addButton}
        onPress={onAddExercisePress}
      >
        <Text style={styles.addButtonText}>Add Exercise</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3D4F',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  exerciseCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#2C3D4F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3D4F',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  removeButton: {
    padding: 4,
  },
  removeButtonText: {
    color: '#A67356',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  setsContainer: {
    marginTop: 8,
  },
  setsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  setHeaderText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#829AAF',
    flex: 1,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    width: 30,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  setNumber: {
    fontSize: 14,
    color: '#2C3D4F',
    width: 30,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  setInput: {
    backgroundColor: '#F5F7FA',
    padding: 8,
    borderRadius: 8,
    fontSize: 14,
    color: '#2C3D4F',
    flex: 1,
    marginHorizontal: 4,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  addSetButton: {
    backgroundColor: '#F5F7FA',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addSetButtonText: {
    color: '#739E82',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  addButton: {
    backgroundColor: '#739E82',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});

export default ExerciseSelector; 