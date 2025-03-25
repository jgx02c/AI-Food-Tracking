import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { WorkoutTemplate, Exercise } from '../types/workout';
import { exercises } from '../data/exercises';

interface WorkoutTemplateEditorProps {
  template?: WorkoutTemplate;
  onSave: (template: WorkoutTemplate) => void;
  onCancel: () => void;
}

const WorkoutTemplateEditor: React.FC<WorkoutTemplateEditorProps> = ({
  template,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(template?.name || '');
  const [description, setDescription] = useState(template?.description || '');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>(
    template?.difficulty || 'intermediate'
  );
  const [selectedExercises, setSelectedExercises] = useState(
    template?.exercises || []
  );

  const addExercise = (exercise: Exercise) => {
    setSelectedExercises([
      ...selectedExercises,
      {
        exerciseId: exercise.id,
        name: exercise.name,
        sets: Array(3).fill({ reps: 10, completed: false }),
        restTime: 90,
      },
    ]);
  };

  const removeExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const updateExerciseSets = (index: number, sets: number) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[index].sets = Array(sets).fill({ 
      reps: 10, 
      completed: false,
      weight: 0 // Default weight
    });
    setSelectedExercises(updatedExercises);
  };

  const updateExerciseReps = (index: number, reps: number) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[index].sets = updatedExercises[index].sets.map(set => ({
      ...set,
      reps,
    }));
    setSelectedExercises(updatedExercises);
  };

  const updateExerciseWeight = (exerciseIndex: number, weight: number) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[exerciseIndex].sets = updatedExercises[exerciseIndex].sets.map(set => ({
      ...set,
      weight,
    }));
    setSelectedExercises(updatedExercises);
  };

  const handleSave = () => {
    const newTemplate: WorkoutTemplate = {
      id: template?.id || Date.now().toString(),
      name,
      description,
      exercises: selectedExercises,
      estimatedDuration: selectedExercises.reduce(
        (acc, exercise) => acc + exercise.sets.length * 2,
        0
      ),
      difficulty,
      muscleGroups: Array.from(
        new Set(
          selectedExercises.flatMap(exercise =>
            exercises.find(e => e.id === exercise.exerciseId)?.muscleGroups || []
          )
        )
      ),
    };
    onSave(newTemplate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {template ? 'Edit Template' : 'New Template'}
        </Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Template Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Template Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#829AAF"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            placeholderTextColor="#829AAF"
          />
          <View style={styles.difficultyContainer}>
            <Text style={styles.label}>Difficulty</Text>
            <View style={styles.difficultyButtons}>
              {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.difficultyButton,
                    difficulty === level && styles.difficultyButtonActive,
                  ]}
                  onPress={() => setDifficulty(level)}
                >
                  <Text
                    style={[
                      styles.difficultyButtonText,
                      difficulty === level && styles.difficultyButtonTextActive,
                    ]}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          {selectedExercises.map((exercise, index) => (
            <View key={exercise.exerciseId} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <TouchableOpacity
                  onPress={() => removeExercise(index)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.exerciseControls}>
                <View style={styles.controlGroup}>
                  <Text style={styles.label}>Sets</Text>
                  <View style={styles.numberInput}>
                    <TouchableOpacity
                      onPress={() => updateExerciseSets(index, Math.max(1, exercise.sets.length - 1))}
                      style={styles.numberButton}
                    >
                      <Text style={styles.numberButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.numberValue}>
                      {exercise.sets.length}
                    </Text>
                    <TouchableOpacity
                      onPress={() => updateExerciseSets(index, exercise.sets.length + 1)}
                      style={styles.numberButton}
                    >
                      <Text style={styles.numberButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.controlGroup}>
                  <Text style={styles.label}>Reps</Text>
                  <View style={styles.numberInput}>
                    <TouchableOpacity
                      onPress={() => updateExerciseReps(index, Math.max(1, exercise.sets[0].reps - 1))}
                      style={styles.numberButton}
                    >
                      <Text style={styles.numberButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.numberValue}>
                      {exercise.sets[0].reps}
                    </Text>
                    <TouchableOpacity
                      onPress={() => updateExerciseReps(index, exercise.sets[0].reps + 1)}
                      style={styles.numberButton}
                    >
                      <Text style={styles.numberButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.controlGroup}>
                  <Text style={styles.label}>Weight (kg)</Text>
                  <View style={styles.numberInput}>
                    <TouchableOpacity
                      onPress={() => updateExerciseWeight(index, Math.max(0, (exercise.sets[0].weight || 0) - 2.5))}
                      style={styles.numberButton}
                    >
                      <Text style={styles.numberButtonText}>-</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={styles.weightInput}
                      value={exercise.sets[0].weight?.toString() || '0'}
                      onChangeText={(value) => updateExerciseWeight(index, parseFloat(value) || 0)}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="#829AAF"
                    />
                    <TouchableOpacity
                      onPress={() => updateExerciseWeight(index, (exercise.sets[0].weight || 0) + 2.5)}
                      style={styles.numberButton}
                    >
                      <Text style={styles.numberButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.setsPreview}>
                {exercise.sets.map((set, setIndex) => (
                  <View key={setIndex} style={styles.setPreview}>
                    <Text style={styles.setPreviewText}>
                      Set {setIndex + 1}: {set.reps} reps @ {set.weight}kg
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Exercise</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.exerciseList}>
              {exercises
                .filter(
                  exercise =>
                    !selectedExercises.some(
                      selected => selected.exerciseId === exercise.id
                    )
                )
                .map(exercise => (
                  <TouchableOpacity
                    key={exercise.id}
                    style={styles.exerciseOption}
                    onPress={() => addExercise(exercise)}
                  >
                    <Text style={styles.exerciseOptionName}>
                      {exercise.name}
                    </Text>
                    <Text style={styles.exerciseOptionMuscles}>
                      {exercise.muscleGroups.join(', ')}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3D4F',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    color: '#A67356',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  saveButton: {
    backgroundColor: '#1E4D6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3D4F',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    color: '#2C3D4F',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  difficultyContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#829AAF',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  difficultyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyButton: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F0',
    alignItems: 'center',
  },
  difficultyButtonActive: {
    backgroundColor: '#1E4D6B',
  },
  difficultyButtonText: {
    color: '#2C3D4F',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  difficultyButtonTextActive: {
    color: '#fff',
  },
  exerciseCard: {
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
  exerciseControls: {
    flexDirection: 'row',
    gap: 16,
  },
  controlGroup: {
    flex: 1,
  },
  numberInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F0',
    borderRadius: 8,
    padding: 4,
  },
  numberButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberButtonText: {
    color: '#2C3D4F',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  numberValue: {
    flex: 1,
    textAlign: 'center',
    color: '#2C3D4F',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  exerciseList: {
    flexDirection: 'row',
    paddingRight: 16,
  },
  exerciseOption: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    width: 160,
    elevation: 1,
    shadowColor: '#2C3D4F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  exerciseOptionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3D4F',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  exerciseOptionMuscles: {
    fontSize: 12,
    color: '#829AAF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  weightInput: {
    flex: 1,
    textAlign: 'center',
    color: '#2C3D4F',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    padding: 0,
  },
  setsPreview: {
    marginTop: 12,
    backgroundColor: '#F5F5F0',
    borderRadius: 8,
    padding: 8,
  },
  setPreview: {
    paddingVertical: 4,
  },
  setPreviewText: {
    fontSize: 14,
    color: '#2C3D4F',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});

export default WorkoutTemplateEditor; 