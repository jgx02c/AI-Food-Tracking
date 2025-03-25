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
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WorkoutTemplate, ActiveWorkout } from '../types/workout';
import { exercises } from '../data/exercises';
import WorkoutTimer from '../components/WorkoutTimer';
import WorkoutTemplateEditor from '../components/WorkoutTemplateEditor';
import { StorageService } from '../services/storage';
import { Ionicons } from '@expo/vector-icons';
import WorkoutCompletionScreen from '../components/WorkoutCompletionScreen';

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
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);

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
    const set = updatedExercises[exerciseIndex].sets[setIndex];
    
    // Toggle completion status
    set.completed = !set.completed;
    
    // If completing the set and no actual weight is set, use the target weight
    if (set.completed && !set.actualWeight && set.weight) {
      set.actualWeight = set.weight;
    }

    const updatedWorkout = {
      ...activeWorkout,
      exercises: updatedExercises,
    };
    setActiveWorkout(updatedWorkout);
    await StorageService.saveActiveWorkout(updatedWorkout);
  };

  const markSetAsFailure = async (exerciseIndex: number, setIndex: number) => {
    if (!activeWorkout) return;

    const updatedExercises = [...activeWorkout.exercises];
    const set = updatedExercises[exerciseIndex].sets[setIndex];
    
    // Toggle failure status
    set.isFailure = !set.isFailure;
    
    // If marking as failure, also mark as completed
    if (set.isFailure) {
      set.completed = true;
    }

    const updatedWorkout = {
      ...activeWorkout,
      exercises: updatedExercises,
    };
    setActiveWorkout(updatedWorkout);
    await StorageService.saveActiveWorkout(updatedWorkout);
  };

  const updateSetWeight = async (exerciseIndex: number, setIndex: number, weight: number) => {
    if (!activeWorkout) return;

    const updatedExercises = [...activeWorkout.exercises];
    updatedExercises[exerciseIndex].sets[setIndex].actualWeight = weight;

    const updatedWorkout = {
      ...activeWorkout,
      exercises: updatedExercises,
    };
    setActiveWorkout(updatedWorkout);
    await StorageService.saveActiveWorkout(updatedWorkout);
  };

  const updateSetReps = async (exerciseIndex: number, setIndex: number, reps: number) => {
    if (!activeWorkout) return;

    const updatedExercises = [...activeWorkout.exercises];
    updatedExercises[exerciseIndex].sets[setIndex].actualReps = reps;

    const updatedWorkout = {
      ...activeWorkout,
      exercises: updatedExercises,
    };
    setActiveWorkout(updatedWorkout);
    await StorageService.saveActiveWorkout(updatedWorkout);
  };

  const addSet = async (exerciseIndex: number) => {
    if (!activeWorkout) return;

    const updatedExercises = [...activeWorkout.exercises];
    const lastSet = updatedExercises[exerciseIndex].sets[updatedExercises[exerciseIndex].sets.length - 1];
    
    updatedExercises[exerciseIndex].sets.push({
      reps: lastSet.reps,
      weight: lastSet.weight,
      completed: false,
    });

    const updatedWorkout = {
      ...activeWorkout,
      exercises: updatedExercises,
    };
    setActiveWorkout(updatedWorkout);
    await StorageService.saveActiveWorkout(updatedWorkout);
  };

  const deleteSet = async (exerciseIndex: number, setIndex: number) => {
    if (!activeWorkout) return;

    Alert.alert(
      'Delete Set',
      'Are you sure you want to delete this set?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedExercises = [...activeWorkout.exercises];
            updatedExercises[exerciseIndex].sets.splice(setIndex, 1);

            const updatedWorkout = {
              ...activeWorkout,
              exercises: updatedExercises,
            };
            setActiveWorkout(updatedWorkout);
            await StorageService.saveActiveWorkout(updatedWorkout);
          },
        },
      ]
    );
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
    await StorageService.saveCompletedWorkout(completedWorkout);
    setShowCompletionScreen(true);
  };

  const handleWorkoutCompletion = () => {
    setShowCompletionScreen(false);
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
              {templates.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No templates yet</Text>
                  <TouchableOpacity
                    style={styles.emptyStateButton}
                    onPress={() => {
                      setEditingTemplate(undefined);
                      setShowTemplateEditor(true);
                    }}
                  >
                    <Text style={styles.emptyStateButtonText}>Add New Template</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                templates.map((template) => (
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
                ))
              )}
            </ScrollView>
          </>
        ) : showCompletionScreen ? (
          <WorkoutCompletionScreen
            workout={activeWorkout!}
            onFinish={handleWorkoutCompletion}
          />
        ) : (
          <>
            <View style={styles.workoutHeader}>
              <View style={styles.timerContainer}>
                <WorkoutTimer
                  onPause={() => setIsTimerPaused(true)}
                  onResume={() => setIsTimerPaused(false)}
                  onStop={cancelWorkout}
                />
                <View style={styles.timerControls}>
                  <TouchableOpacity
                    style={styles.timerControlButton}
                    onPress={() => setIsTimerPaused(!isTimerPaused)}
                  >
                    <Ionicons
                      name={isTimerPaused ? 'play' : 'pause'}
                      size={24}
                      color="#1E4D6B"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.timerControlButton}
                    onPress={cancelWorkout}
                  >
                    <Ionicons name="stop" size={24} color="#A67356" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <ScrollView style={styles.exercisesContainer}>
              {activeWorkout?.exercises.map((exercise, exerciseIndex) => (
                <View key={exercise.exerciseId} style={styles.exerciseCard}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <View style={styles.setsList}>
                    {exercise.sets.map((set, setIndex) => (
                      <TouchableOpacity
                        key={setIndex}
                        style={styles.setRow}
                        onLongPress={() => deleteSet(exerciseIndex, setIndex)}
                        delayLongPress={500}
                      >
                        <View style={styles.setCell}>
                          <Text style={styles.setCellText}>
                            {set.weight ? `${set.weight}kg` : '-'}
                          </Text>
                        </View>
                        <View style={styles.setCell}>
                          <Text style={styles.setCellText}>
                            {set.reps}
                          </Text>
                        </View>
                        <View style={styles.setCell}>
                          <TextInput
                            style={[
                              styles.setCellInput,
                              set.completed && styles.completedInput
                            ]}
                            value={set.actualWeight?.toString() || ''}
                            onChangeText={(value) => updateSetWeight(exerciseIndex, setIndex, parseFloat(value) || 0)}
                            keyboardType="numeric"
                            placeholder="-"
                            placeholderTextColor="#829AAF"
                            editable={!set.completed}
                          />
                        </View>
                        <View style={styles.setCell}>
                          <TextInput
                            style={[
                              styles.setCellInput,
                              set.completed && styles.completedInput
                            ]}
                            value={set.actualReps?.toString() || ''}
                            onChangeText={(value) => updateSetReps(exerciseIndex, setIndex, parseInt(value) || 0)}
                            keyboardType="numeric"
                            placeholder="-"
                            placeholderTextColor="#829AAF"
                            editable={!set.completed}
                          />
                        </View>
                        <View style={styles.setCell}>
                          <TouchableOpacity
                            style={[
                              styles.setActionButton,
                              set.completed && styles.completedSet,
                            ]}
                            onPress={() => completeSet(exerciseIndex, setIndex)}
                          >
                            <Text
                              style={[
                                styles.setActionText,
                                set.completed && styles.completedSetText,
                              ]}
                            >
                              {set.completed ? '✓' : 'P'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.setCell}>
                          <TouchableOpacity
                            style={[
                              styles.setActionButton,
                              styles.failureButton,
                              set.isFailure && styles.failureSet,
                            ]}
                            onPress={() => markSetAsFailure(exerciseIndex, setIndex)}
                          >
                            <Text
                              style={[
                                styles.setActionText,
                                set.isFailure && styles.failureSetText,
                              ]}
                            >
                              {set.isFailure ? '✓' : 'F'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                      style={styles.addSetButton}
                      onPress={() => addSet(exerciseIndex)}
                    >
                      <Ionicons name="add-circle" size={20} color="#739E82" />
                      <Text style={styles.addSetText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
            <View style={styles.workoutFooter}>
              <TouchableOpacity
                style={styles.finishButton}
                onPress={finishWorkout}
              >
                <Text style={styles.finishButtonText}>Finish Workout</Text>
              </TouchableOpacity>
            </View>
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
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3D4F',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    letterSpacing: -0.5,
    flex: 1,
    marginRight: 16,
  },
  addButton: {
    backgroundColor: '#1E4D6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
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
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F0',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerControls: {
    flexDirection: 'row',
    gap: 16,
  },
  timerControlButton: {
    padding: 8,
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
  setsList: {
    marginTop: 12,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F0',
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  setCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  setCellText: {
    fontSize: 14,
    color: '#2C3D4F',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  setCellInput: {
    fontSize: 14,
    color: '#2C3D4F',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 4,
    width: '100%',
  },
  completedInput: {
    backgroundColor: '#F5F5F0',
    color: '#829AAF',
  },
  setActionButton: {
    backgroundColor: '#F5F5F0',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setActionText: {
    fontSize: 14,
    color: '#2C3D4F',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  completedSet: {
    backgroundColor: '#739E82',
  },
  completedSetText: {
    color: '#fff',
  },
  failureButton: {
    backgroundColor: '#F5F5F0',
  },
  failureSet: {
    backgroundColor: '#A67356',
  },
  failureSetText: {
    color: '#fff',
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
  addSetText: {
    fontSize: 16,
    color: '#739E82',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  workoutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F0',
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#829AAF',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  emptyStateButton: {
    backgroundColor: '#1E4D6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});

export default WorkoutScreen; 