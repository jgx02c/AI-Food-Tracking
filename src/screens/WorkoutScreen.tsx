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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WorkoutTemplate, ActiveWorkout } from '../types/workout';
import { StorageService } from '../services/storage';
import WorkoutTemplateEditor from '../components/workout/WorkoutTemplateEditor';
import WorkoutCompletionScreen from '../components/WorkoutCompletionScreen';

import TemplateList from '../components/workout/TemplateList';
import ExerciseCard from '../components/workout/ExerciseCard';
import WorkoutHeader from '../components/workout/WorkoutHeader';

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

  const handleEditTemplate = (template: WorkoutTemplate) => {
    setEditingTemplate(template);
    setShowTemplateEditor(true);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    Alert.alert(
      'Delete Template',
      'Are you sure you want to delete this template?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await StorageService.deleteWorkoutTemplate(templateId);
            const updatedTemplates = templates.filter(t => t.id !== templateId);
            setTemplates(updatedTemplates);
          },
        },
      ]
    );
  };

  const startWorkout = async (template: WorkoutTemplate) => {
    const newWorkout: ActiveWorkout = {
      id: Date.now().toString(),
      templateId: template.id,
      template,
      startTime: new Date(),
      exercises: template.exercises.map(exercise => ({
        exerciseId: exercise.exerciseId,
        name: exercise.name,
        sets: exercise.sets.map(set => ({
          reps: set.reps,
          weight: set.weight,
          actualWeight: undefined,
          actualReps: undefined,
          completed: false,
          isFailure: false,
        })),
      })),
      status: 'inProgress',
    };

    await StorageService.saveActiveWorkout(newWorkout);
    setActiveWorkout(newWorkout);
    setShowTemplates(false);
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

  const completeSet = async (exerciseIndex: number, setIndex: number) => {
    if (!activeWorkout) return;

    const updatedExercises = [...activeWorkout.exercises];
    const set = updatedExercises[exerciseIndex].sets[setIndex];
    
    // Toggle completion state
    set.completed = !set.completed;
    
    // If uncompleting, also clear failure state
    if (!set.completed) {
      set.isFailure = false;
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
    
    // Toggle failure state
    set.isFailure = !set.isFailure;
    
    // If marking as failure, also clear completion state
    if (set.isFailure) {
      set.completed = false;
    }

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

  const addSet = async (exerciseIndex: number) => {
    if (!activeWorkout) return;

    const updatedExercises = [...activeWorkout.exercises];
    const lastSet = updatedExercises[exerciseIndex].sets[updatedExercises[exerciseIndex].sets.length - 1];
    updatedExercises[exerciseIndex].sets.push({
      ...lastSet,
      actualWeight: undefined,
      actualReps: undefined,
      completed: false,
      isFailure: false,
    });

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
            <TemplateList
              templates={templates}
              onEditTemplate={handleEditTemplate}
              onDeleteTemplate={handleDeleteTemplate}
              onStartWorkout={startWorkout}
            />
          </>
        ) : showCompletionScreen ? (
          <WorkoutCompletionScreen
            workout={activeWorkout!}
            onFinish={handleWorkoutCompletion}
          />
        ) : (
          <>
            <WorkoutHeader
              onPause={() => setIsTimerPaused(true)}
              onResume={() => setIsTimerPaused(false)}
              onStop={cancelWorkout}
              isPaused={isTimerPaused}
            />
            <ScrollView style={styles.exercisesContainer}>
              {activeWorkout?.exercises.map((exercise, exerciseIndex) => (
                <ExerciseCard
                  key={exercise.exerciseId}
                  exercise={exercise}
                  exerciseIndex={exerciseIndex}
                  onUpdateSetWeight={updateSetWeight}
                  onUpdateSetReps={updateSetReps}
                  onCompleteSet={completeSet}
                  onMarkSetAsFailure={markSetAsFailure}
                  onDeleteSet={deleteSet}
                  onAddSet={addSet}
                />
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
          onSave={async (template) => {
            if (editingTemplate) {
              await StorageService.saveWorkoutTemplate(template);
              const updatedTemplates = templates.map(t =>
                t.id === editingTemplate.id ? template : t
              );
              setTemplates(updatedTemplates);
            } else {
              await StorageService.saveWorkoutTemplate(template);
              const newTemplates = [...templates, template];
              setTemplates(newTemplates);
            }
            setShowTemplateEditor(false);
          }}
          onCancel={() => setShowTemplateEditor(false)}
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
  exercisesContainer: {
    flex: 1,
    padding: 16,
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
});

export default WorkoutScreen; 