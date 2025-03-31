import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { WorkoutTemplate, Exercise, WorkoutExercise } from '../../types/workout';
import ExerciseSelector from './ExerciseSelector';
import ExerciseSelectionModal from './ExerciseSelectionModal';

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
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>(
    template?.exercises || []
  );
  const [showExerciseModal, setShowExerciseModal] = useState(false);

  const handleAddExercise = (exercise: Exercise) => {
    const newExercise: WorkoutExercise = {
      exerciseId: exercise.id,
      name: exercise.name,
      sets: [{
        reps: 10,
        weight: 0,
        restTime: 90,
      }],
    };
    setSelectedExercises([...selectedExercises, newExercise]);
    setShowExerciseModal(false);
  };

  const handleRemoveExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const handleUpdateExerciseSet = (exerciseIndex: number, setIndex: number, field: 'reps' | 'weight' | 'restTime', value: number) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[exerciseIndex].sets[setIndex] = {
      ...updatedExercises[exerciseIndex].sets[setIndex],
      [field]: value,
    };
    setSelectedExercises(updatedExercises);
  };

  const handleAddSet = (exerciseIndex: number) => {
    const updatedExercises = [...selectedExercises];
    const lastSet = updatedExercises[exerciseIndex].sets[updatedExercises[exerciseIndex].sets.length - 1];
    updatedExercises[exerciseIndex].sets.push({
      reps: lastSet.reps,
      weight: lastSet.weight,
      restTime: lastSet.restTime,
    });
    setSelectedExercises(updatedExercises);
  };

  const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[exerciseIndex].sets.splice(setIndex, 1);
    setSelectedExercises(updatedExercises);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a template name');
      return;
    }

    const newTemplate: WorkoutTemplate = {
      id: template?.id || Date.now().toString(),
      name: name.trim(),
      exercises: selectedExercises,
      calories: 0, // Default value since we're not using it
    };

    onSave(newTemplate);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {template ? 'Edit Template' : 'Create Template'}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Template Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter template name"
            />
          </View>

          <ExerciseSelector
            selectedExercises={selectedExercises}
            onAddExercise={handleAddExercise}
            onRemoveExercise={handleRemoveExercise}
            onUpdateExerciseSet={handleUpdateExerciseSet}
            onAddSet={handleAddSet}
            onRemoveSet={handleRemoveSet}
            onAddExercisePress={() => setShowExerciseModal(true)}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Template</Text>
        </TouchableOpacity>
      </View>

      <ExerciseSelectionModal
        visible={showExerciseModal}
        onClose={() => setShowExerciseModal(false)}
        onSelect={handleAddExercise}
        selectedExerciseIds={selectedExercises.map(ex => ex.exerciseId)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E9F2',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3D4F',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3D4F',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#2C3D4F',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    borderWidth: 1,
    borderColor: '#E5E9F2',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E9F2',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#F5F7FA',
  },
  saveButton: {
    backgroundColor: '#739E82',
  },
  cancelButtonText: {
    color: '#2C3D4F',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});

export default WorkoutTemplateEditor; 