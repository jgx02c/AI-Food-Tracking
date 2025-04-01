import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutTemplate, WorkoutExercise } from '../../types/workout';

interface TemplateEditorProps {
  template?: WorkoutTemplate;
  onSave: (template: WorkoutTemplate) => void;
  onCancel: () => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(template?.name || '');
  const [exercises, setExercises] = useState<WorkoutExercise[]>(
    template?.exercises || []
  );

  const handleAddExercise = () => {
    const newExercise: WorkoutExercise = {
      exerciseId: Date.now().toString(),
      name: '',
      sets: [],
    };
    setExercises([...exercises, newExercise]);
  };

  const handleUpdateExercise = (index: number, field: keyof WorkoutExercise, value: any) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value,
    };
    setExercises(updatedExercises);
  };

  const handleAddSet = (exerciseIndex: number) => {
    const updatedExercises = [...exercises];
    const exercise = updatedExercises[exerciseIndex];
    exercise.sets.push({
      reps: 10,
      weight: 0,
      restTime: 60,
    });
    setExercises(updatedExercises);
  };

  const handleUpdateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: 'reps' | 'weight' | 'restTime',
    value: number
  ) => {
    const updatedExercises = [...exercises];
    const set = updatedExercises[exerciseIndex].sets[setIndex];
    set[field] = value;
    setExercises(updatedExercises);
  };

  const handleDeleteSet = (exerciseIndex: number, setIndex: number) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets.splice(setIndex, 1);
    setExercises(updatedExercises);
  };

  const handleDeleteExercise = (index: number) => {
    Alert.alert(
      'Delete Exercise',
      'Are you sure you want to delete this exercise?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedExercises = exercises.filter((_, i) => i !== index);
            setExercises(updatedExercises);
          },
        },
      ]
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a template name');
      return;
    }

    if (exercises.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise');
      return;
    }

    const hasEmptyExercises = exercises.some(
      exercise => !exercise.name.trim() || exercise.sets.length === 0
    );

    if (hasEmptyExercises) {
      Alert.alert('Error', 'Please complete all exercise details');
      return;
    }

    const newTemplate: WorkoutTemplate = {
      id: template?.id || Date.now().toString(),
      name: name.trim(),
      exercises,
      calories: 0, // This will be calculated based on exercises
    };

    onSave(newTemplate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Template Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter template name"
          placeholderTextColor="#BDC3C7"
        />
      </View>

      <ScrollView style={styles.exercisesContainer}>
        {exercises.map((exercise, exerciseIndex) => (
          <View key={exercise.exerciseId} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <TextInput
                style={styles.exerciseNameInput}
                value={exercise.name}
                onChangeText={(value) =>
                  handleUpdateExercise(exerciseIndex, 'name', value)
                }
                placeholder="Exercise name"
                placeholderTextColor="#BDC3C7"
              />
              <TouchableOpacity
                onPress={() => handleDeleteExercise(exerciseIndex)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={24} color="#E74C3C" />
              </TouchableOpacity>
            </View>

            <View style={styles.setsContainer}>
              {exercise.sets.map((set, setIndex) => (
                <View key={setIndex} style={styles.setCard}>
                  <View style={styles.setHeader}>
                    <Text style={styles.setNumber}>Set {setIndex + 1}</Text>
                    <TouchableOpacity
                      onPress={() => handleDeleteSet(exerciseIndex, setIndex)}
                      style={styles.deleteSetButton}
                    >
                      <Ionicons name="close-circle" size={20} color="#E74C3C" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.setInputs}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Reps</Text>
                      <TextInput
                        style={styles.numberInput}
                        value={set.reps.toString()}
                        onChangeText={(value) =>
                          handleUpdateSet(
                            exerciseIndex,
                            setIndex,
                            'reps',
                            parseInt(value) || 0
                          )
                        }
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Weight (kg)</Text>
                      <TextInput
                        style={styles.numberInput}
                        value={set.weight.toString()}
                        onChangeText={(value) =>
                          handleUpdateSet(
                            exerciseIndex,
                            setIndex,
                            'weight',
                            parseFloat(value) || 0
                          )
                        }
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Rest (s)</Text>
                      <TextInput
                        style={styles.numberInput}
                        value={set.restTime.toString()}
                        onChangeText={(value) =>
                          handleUpdateSet(
                            exerciseIndex,
                            setIndex,
                            'restTime',
                            parseInt(value) || 0
                          )
                        }
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.addSetButton}
              onPress={() => handleAddSet(exerciseIndex)}
            >
              <Ionicons name="add-circle-outline" size={24} color="#1E4D6B" />
              <Text style={styles.addSetText}>Add Set</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.addExerciseButton}
        onPress={handleAddExercise}
      >
        <Ionicons name="add-circle-outline" size={24} color="#1E4D6B" />
        <Text style={styles.addExerciseText}>Add Exercise</Text>
      </TouchableOpacity>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  input: {
    fontSize: 18,
    color: '#2C3E50',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  exercisesContainer: {
    flex: 1,
    padding: 16,
  },
  exerciseCard: {
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
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exerciseNameInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    padding: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
  setsContainer: {
    marginBottom: 16,
  },
  setCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  setHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  setNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  deleteSetButton: {
    padding: 4,
  },
  setInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 4,
  },
  inputLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  numberInput: {
    fontSize: 14,
    color: '#2C3E50',
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    textAlign: 'center',
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  addSetText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1E4D6B',
    fontWeight: '600',
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  addExerciseText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#1E4D6B',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#F8F9FA',
  },
  saveButton: {
    backgroundColor: '#1E4D6B',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default TemplateEditor; 