import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WorkoutTemplate, ActiveWorkout } from '../types/workout';
import { exercises } from '../data/exercises';
import WorkoutTimer from '../components/WorkoutTimer';
import WorkoutTemplateEditor from '../components/WorkoutTemplateEditor';
import { StorageService } from '../services/storage';

// Mock data for demonstration
const mockTemplates: WorkoutTemplate[] = [
  {
    id: '1',
    name: 'Full Body Workout',
    description: 'A balanced workout targeting all major muscle groups',
    exercises: [
      {
        exerciseId: 'bench-press',
        name: 'Bench Press',
        sets: Array(3).fill({ reps: 10, completed: false }),
        restTime: 90,
      },
      {
        exerciseId: 'squats',
        name: 'Squats',
        sets: Array(4).fill({ reps: 12, completed: false }),
        restTime: 90,
      },
      {
        exerciseId: 'bent-over-rows',
        name: 'Bent Over Rows',
        sets: Array(3).fill({ reps: 12, completed: false }),
        restTime: 90,
      },
    ],
    estimatedDuration: 45,
    difficulty: 'intermediate',
    muscleGroups: ['chest', 'legs', 'back'],
  },
  {
    id: '2',
    name: 'Upper Body Focus',
    description: 'Target your chest, back, and arms',
    exercises: [
      {
        exerciseId: 'bench-press',
        name: 'Bench Press',
        sets: Array(4).fill({ reps: 8, completed: false }),
        restTime: 120,
      },
      {
        exerciseId: 'pull-ups',
        name: 'Pull-Ups',
        sets: Array(3).fill({ reps: 8, completed: false }),
        restTime: 90,
      },
      {
        exerciseId: 'overhead-press',
        name: 'Overhead Press',
        sets: Array(3).fill({ reps: 10, completed: false }),
        restTime: 90,
      },
    ],
    estimatedDuration: 40,
    difficulty: 'intermediate',
    muscleGroups: ['chest', 'back', 'shoulders'],
  },
];

const WorkoutScreen = () => {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(null);
  const [showTemplates, setShowTemplates] = useState(true);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | undefined>();
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  useEffect(() => {
    loadTemplates();
    loadActiveWorkout();
  }, []);

  const loadTemplates = async () => {
    const savedTemplates = await StorageService.getWorkoutTemplates();
    setTemplates(savedTemplates);
  };

  const loadActiveWorkout = async () => {
    const savedWorkout = await StorageService.getActiveWorkout();
    if (savedWorkout) {
      setActiveWorkout(savedWorkout);
      setShowTemplates(false);
    }
  };

  const startWorkout = async (template: WorkoutTemplate) => {
    const newWorkout: ActiveWorkout = {
      id: Date.now().toString(),
      templateId: template.id,
      startTime: new Date(),
      exercises: template.exercises.map(exercise => ({
        ...exercise,
        sets: exercise.sets.map(set => ({ ...set, completed: false })),
      })),
      status: 'inProgress',
    };
    setActiveWorkout(newWorkout);
    await StorageService.saveActiveWorkout(newWorkout);
    setShowTemplates(false);
  };

  const completeSet = async (exerciseIndex: number, setIndex: number) => {
    if (!activeWorkout) return;

    const updatedExercises = [...activeWorkout.exercises];
    updatedExercises[exerciseIndex].sets[setIndex].completed = true;

    const updatedWorkout = {
      ...activeWorkout,
      exercises: updatedExercises,
    };
    setActiveWorkout(updatedWorkout);
    await StorageService.saveActiveWorkout(updatedWorkout);
  };

  const finishWorkout = async () => {
    if (!activeWorkout) return;

    const completedWorkout: ActiveWorkout = {
      ...activeWorkout,
      endTime: new Date(),
      status: 'completed' as const,
    };
    setActiveWorkout(completedWorkout);
    await StorageService.saveActiveWorkout(completedWorkout);
    setShowTemplates(true);
  };

  const cancelWorkout = async () => {
    if (!activeWorkout) return;

    const cancelledWorkout: ActiveWorkout = {
      ...activeWorkout,
      endTime: new Date(),
      status: 'cancelled' as const,
    };
    setActiveWorkout(cancelledWorkout);
    await StorageService.saveActiveWorkout(cancelledWorkout);
    setShowTemplates(true);
  };

  const handleSaveTemplate = async (template: WorkoutTemplate) => {
    let updatedTemplates: WorkoutTemplate[];
    if (editingTemplate) {
      updatedTemplates = templates.map(t => (t.id === template.id ? template : t));
    } else {
      updatedTemplates = [...templates, template];
    }
    setTemplates(updatedTemplates);
    await StorageService.saveWorkoutTemplates(updatedTemplates);
    setShowTemplateEditor(false);
    setEditingTemplate(undefined);
  };

  const handleEditTemplate = (template: WorkoutTemplate) => {
    setEditingTemplate(template);
    setShowTemplateEditor(true);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(updatedTemplates);
    await StorageService.saveWorkoutTemplates(updatedTemplates);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F0" />
      <View style={styles.container}>
        {showTemplates ? (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Workout Templates</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  setEditingTemplate(undefined);
                  setShowTemplateEditor(true);
                }}
              >
                <Text style={styles.addButtonText}>New Template</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.templatesContainer}>
              {templates.map((template) => (
                <View key={template.id} style={styles.templateCard}>
                  <View style={styles.templateHeader}>
                    <Text style={styles.templateName}>{template.name}</Text>
                    <View style={styles.templateActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleEditTemplate(template)}
                      >
                        <Text style={styles.actionButtonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => handleDeleteTemplate(template.id)}
                      >
                        <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.templateDescription}>
                    {template.description}
                  </Text>
                  <View style={styles.templateDetails}>
                    <Text style={styles.detailText}>
                      {template.exercises.length} exercises
                    </Text>
                    <Text style={styles.detailText}>
                      {template.estimatedDuration} min
                    </Text>
                    <Text style={styles.detailText}>
                      {template.difficulty}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => startWorkout(template)}
                  >
                    <Text style={styles.startButtonText}>Start Workout</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </>
        ) : (
          <>
            <View style={styles.workoutHeader}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelWorkout}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <WorkoutTimer
                onPause={() => setIsTimerPaused(true)}
                onResume={() => setIsTimerPaused(false)}
                onStop={cancelWorkout}
              />
              <TouchableOpacity
                style={styles.finishButton}
                onPress={finishWorkout}
              >
                <Text style={styles.finishButtonText}>Finish Workout</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.exercisesContainer}>
              {activeWorkout?.exercises.map((exercise, exerciseIndex) => (
                <View key={exercise.exerciseId} style={styles.exerciseCard}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <View style={styles.setsContainer}>
                    {exercise.sets.map((set, setIndex) => (
                      <TouchableOpacity
                        key={setIndex}
                        style={[
                          styles.setButton,
                          set.completed && styles.completedSet,
                        ]}
                        onPress={() => completeSet(exerciseIndex, setIndex)}
                        disabled={set.completed}
                      >
                        <Text
                          style={[
                            styles.setText,
                            set.completed && styles.completedSetText,
                          ]}
                        >
                          {set.reps} reps
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          </>
        )}
      </View>

      <Modal
        visible={showTemplateEditor}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <WorkoutTemplateEditor
          template={editingTemplate}
          onSave={handleSaveTemplate}
          onCancel={() => {
            setShowTemplateEditor(false);
            setEditingTemplate(undefined);
          }}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3D4F',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    letterSpacing: -0.5,
  },
  addButton: {
    backgroundColor: '#1E4D6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  templatesContainer: {
    flex: 1,
    padding: 16,
  },
  templateCard: {
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
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  templateName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3D4F',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  templateActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  actionButtonText: {
    color: '#1E4D6B',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  deleteButton: {
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#A67356',
  },
  templateDescription: {
    fontSize: 15,
    color: '#829AAF',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  templateDetails: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#739E82',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: '#739E82',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F0',
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
  finishButton: {
    backgroundColor: '#1E4D6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  exercisesContainer: {
    flex: 1,
    padding: 16,
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
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3D4F',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  setsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  setButton: {
    backgroundColor: '#F5F5F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  completedSet: {
    backgroundColor: '#739E82',
  },
  setText: {
    color: '#2C3D4F',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  completedSetText: {
    color: '#fff',
  },
});

export default WorkoutScreen; 