import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ActiveWorkout } from '../../types/workout';

interface ExerciseCardProps {
  exercise: ActiveWorkout['exercises'][0];
  exerciseIndex: number;
  onUpdateSetWeight: (exerciseIndex: number, setIndex: number, weight: number) => void;
  onUpdateSetReps: (exerciseIndex: number, setIndex: number, reps: number) => void;
  onCompleteSet: (exerciseIndex: number, setIndex: number) => void;
  onMarkSetAsFailure: (exerciseIndex: number, setIndex: number) => void;
  onDeleteSet: (exerciseIndex: number, setIndex: number) => void;
  onAddSet: (exerciseIndex: number) => void;
}

const ExerciseCard = ({
  exercise,
  exerciseIndex,
  onUpdateSetWeight,
  onUpdateSetReps,
  onCompleteSet,
  onMarkSetAsFailure,
  onDeleteSet,
  onAddSet,
}: ExerciseCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
      </View>

      <View style={styles.setsContainer}>
        <View style={styles.setsHeader}>
          <Text style={styles.setHeaderText}>Set</Text>
          <Text style={styles.setHeaderText}>Goal</Text>
          <Text style={styles.setHeaderText}>Reps</Text>
          <Text style={styles.setHeaderText}>Weight</Text>
          <Text style={styles.setHeaderText}>Status</Text>
        </View>
        {exercise.sets.map((set, setIndex) => (
          <View key={setIndex} style={styles.setRow}>
            <Text style={styles.setNumber}>{setIndex + 1}</Text>
            <Text style={styles.setValue}>{set.reps}</Text>
            <TextInput
              style={[styles.setInput, set.completed && styles.completedInput]}
              value={set.actualReps?.toString() || ''}
              onChangeText={(text) => onUpdateSetReps(exerciseIndex, setIndex, parseInt(text) || 0)}
              keyboardType="numeric"
              placeholder="0"
              editable={!set.completed}
            />
            <TextInput
              style={[styles.setInput, set.completed && styles.completedInput]}
              value={set.actualWeight?.toString() || ''}
              onChangeText={(text) => onUpdateSetWeight(exerciseIndex, setIndex, parseInt(text) || 0)}
              keyboardType="numeric"
              placeholder="0"
              editable={!set.completed}
            />
            <View style={styles.setActions}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  set.completed && styles.completedButton,
                  set.isFailure && styles.inactiveButton
                ]}
                onPress={() => {
                  if (set.isFailure) {
                    onMarkSetAsFailure(exerciseIndex, setIndex);
                  } else {
                    onCompleteSet(exerciseIndex, setIndex);
                  }
                }}
              >
                <Ionicons
                  name={set.completed ? 'checkmark-circle' : 'ellipse-outline'}
                  size={20}
                  color={set.completed ? '#fff' : '#829AAF'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  set.isFailure && styles.failureButton,
                  set.completed && styles.inactiveButton
                ]}
                onPress={() => {
                  if (set.completed) {
                    onCompleteSet(exerciseIndex, setIndex);
                  } else {
                    onMarkSetAsFailure(exerciseIndex, setIndex);
                  }
                }}
              >
                <Ionicons
                  name={set.isFailure ? 'close-circle' : 'close-circle-outline'}
                  size={20}
                  color={set.isFailure ? '#fff' : '#829AAF'}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addSetButton}
          onPress={() => onAddSet(exerciseIndex)}
        >
          <Text style={styles.addSetButtonText}>Add Set</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3D4F',
    marginRight: 12,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  setsContainer: {
    marginTop: 12,
  },
  setsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E9F2',
    paddingBottom: 4,
  },
  setHeaderText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#829AAF',
    flex: 1,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    minWidth: 40,
  },
  setValue: {
    fontSize: 14,
    color: '#2C3D4F',
    flex: 1,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    minWidth: 40,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F0',
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
    gap: 4,
  },
  setNumber: {
    fontSize: 14,
    color: '#2C3D4F',
    flex: 1,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    minWidth: 40,
  },
  setInput: {
    fontSize: 14,
    color: '#2C3D4F',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 4,
    flex: 1,
    minWidth: 40,
  },
  setActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 80,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F0',
  },
  completedButton: {
    backgroundColor: '#739E82',
  },
  failureButton: {
    backgroundColor: '#A67356',
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: 8,
    backgroundColor: '#F5F5F0',
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'center',
  },
  addSetButtonText: {
    fontSize: 16,
    color: '#739E82',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  completedInput: {
    backgroundColor: '#F5F5F0',
    color: '#829AAF',
  },
  inactiveButton: {
    backgroundColor: '#F5F5F0',
  },
});

export default ExerciseCard; 