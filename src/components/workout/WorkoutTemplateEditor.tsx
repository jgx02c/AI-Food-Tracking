import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { WorkoutTemplate, Exercise, WorkoutExercise } from '../../types/workout';
import ExerciseSelectionModal from './ExerciseSelectionModal';
import ExerciseSelector from './ExerciseSelector';
import { exercises } from '../../data/exercises';

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

  const handleExerciseSelect = (exercise: Exercise) => {
    // Check if exercise is already in the template
    if (selectedExercises.some(ex => ex.exerciseId === exercise.id)) {
      alert('This exercise is already in the template');
      return;
    }

    const newExercise: WorkoutExercise = {
      exerciseId: exercise.id,
      name: exercise.name,
      sets: [{
        reps: 10,
        weight: 0,
        restTime: 60,
      }],
    };
    setSelectedExercises([...selectedExercises, newExercise]);
  };

  const handleRemoveExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const handleUpdateExerciseSet = (exerciseIndex: number, setIndex: number, field: 'reps' | 'weight' | 'restTime', value: number) => {
    const updatedExercises = [...selectedExercises];
    const exercise = updatedExercises[exerciseIndex];
    exercise.sets[setIndex] = {
      ...exercise.sets[setIndex],
      [field]: value,
    };
    setSelectedExercises(updatedExercises);
  };

  const handleAddSet = (exerciseIndex: number) => {
    const updatedExercises = [...selectedExercises];
    const exercise = updatedExercises[exerciseIndex];
    exercise.sets.push({
      reps: 10,
      weight: 0,
      restTime: 60,
    });
    setSelectedExercises(updatedExercises);
  };

  const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
    const updatedExercises = [...selectedExercises];
    const exercise = updatedExercises[exerciseIndex];
    exercise.sets.splice(setIndex, 1);
    setSelectedExercises(updatedExercises);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a template name');
      return;
    }

    if (selectedExercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    onSave({
      ...template,
      id: template?.id || Date.now().toString(),
      name: name.trim(),
      exercises: selectedExercises,
      calories: 0, // This will be calculated based on exercises
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Edit Workout Template</Text>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formGroup}>
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
          onAddExercise={() => setShowExerciseModal(true)}
          onRemoveExercise={handleRemoveExercise}
          onUpdateExerciseSet={handleUpdateExerciseSet}
          onAddSet={handleAddSet}
          onRemoveSet={handleRemoveSet}
          onAddExercisePress={() => setShowExerciseModal(true)}
        />
      </ScrollView>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Save Template</Text>
      </TouchableOpacity>

      <ExerciseSelectionModal
        visible={showExerciseModal}
        onClose={() => setShowExerciseModal(false)}
        onSelect={handleExerciseSelect}
        selectedExerciseIds={selectedExercises.map(ex => ex.exerciseId)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
  },
  cancelButton: {
    fontSize: 16,
    color: '#1E4D6B',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  saveButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#1E4D6B',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WorkoutTemplateEditor; 