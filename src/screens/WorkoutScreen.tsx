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
  ActionSheetIOS,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutTemplate, ActiveWorkout } from '../types/workout';
import { StorageService } from '../services/storage';
import WorkoutTemplateEditor from '../components/workout/WorkoutTemplateEditor';
import WorkoutCompletionScreen from '../components/WorkoutCompletionScreen';
import TemplateList from '../components/workout/TemplateList';
import WorkoutListView from '../components/workout/WorkoutListView';
import ActiveWorkoutView from '../components/workout/ActiveWorkoutView';
import WorkoutHeaderTabs from '../components/workout/WorkoutHeaderTabs';
import { format, isToday, isYesterday, isThisWeek, subWeeks } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

type TabType = 'templates' | 'workouts';

const WorkoutScreen = () => {
  const navigation = useNavigation();
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(null);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | undefined>();
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('templates');
  const [completedWorkouts, setCompletedWorkouts] = useState<ActiveWorkout[]>([]);

  useEffect(() => {
    loadTemplates();
    loadActiveWorkout();
    loadCompletedWorkouts();
  }, []);

  const loadTemplates = async () => {
    const savedTemplates = await StorageService.getWorkoutTemplates();
    console.log('Loaded templates:', savedTemplates);
    setTemplates(savedTemplates);
  };

  const loadCompletedWorkouts = async () => {
    const workouts = await StorageService.getCompletedWorkouts();
    setCompletedWorkouts(workouts);
  };

  const loadActiveWorkout = async () => {
    const savedWorkout = await StorageService.getActiveWorkout();
    if (savedWorkout) {
      // Only set active workout if it's in progress
      if (savedWorkout.status === 'inProgress') {
        setActiveWorkout(savedWorkout);
      } else {
        // Clear any completed or cancelled workouts
        await StorageService.saveActiveWorkout(null);
      }
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

    try {
      // Create completed workout with current template data
      const completedWorkout: ActiveWorkout = {
        ...activeWorkout,
        endTime: new Date(),
        status: 'completed' as const,
      };

      // Save the completed workout
      await StorageService.saveCompletedWorkout(completedWorkout);
      
      // Clear the active workout
      await StorageService.saveActiveWorkout(null);
      
      // Update state
      setActiveWorkout(completedWorkout);
      setShowCompletionScreen(true);
    } catch (error) {
      console.error('Error finishing workout:', error);
      Alert.alert(
        'Error',
        'Failed to save the completed workout. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleWorkoutCompletion = () => {
    setShowCompletionScreen(false);
    setActiveWorkout(null);
    loadCompletedWorkouts();
    setActiveTab('workouts'); // Switch to workouts tab to show the completed workout
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
    setActiveWorkout(null);
  };

  const showAddOptions = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Add Template'],
        cancelButtonIndex: 0,
      },
      (buttonIndex: number) => {
        if (buttonIndex === 1) {
          setEditingTemplate(undefined);
          setShowTemplateEditor(true);
        }
      }
    );
  };

  const handleStopTimer = () => {
    Alert.alert(
      'Stop Workout',
      'Are you sure you want to stop this workout? This will cancel the current session.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Stop',
          style: 'destructive',
          onPress: () => {
            cancelWorkout();
            setActiveTab('templates'); // Switch back to templates tab
          },
        },
      ]
    );
  };

  const groupedWorkouts = {
    today: completedWorkouts.filter(workout => isToday(new Date(workout.startTime))),
    yesterday: completedWorkouts.filter(workout => isYesterday(new Date(workout.startTime))),
    thisWeek: completedWorkouts.filter(workout => {
      const workoutDate = new Date(workout.startTime);
      return isThisWeek(workoutDate) && !isToday(workoutDate) && !isYesterday(workoutDate);
    }),
    lastWeek: completedWorkouts.filter(workout => {
      const workoutDate = new Date(workout.startTime);
      const now = new Date();
      const lastWeekStart = subWeeks(now, 1);
      const lastWeekEnd = subWeeks(now, 0);
      return workoutDate >= lastWeekStart && workoutDate < lastWeekEnd;
    }),
    older: completedWorkouts.filter(workout => {
      const workoutDate = new Date(workout.startTime);
      const now = new Date();
      const lastWeekStart = subWeeks(now, 1);
      return workoutDate < lastWeekStart;
    }),
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F0" />
      <View style={styles.container}>
        {activeWorkout ? (
          showCompletionScreen ? (
            <WorkoutCompletionScreen
              workout={activeWorkout}
              onFinish={handleWorkoutCompletion}
            />
          ) : (
            <ActiveWorkoutView
              workout={activeWorkout}
              isTimerPaused={isTimerPaused}
              onPause={() => setIsTimerPaused(true)}
              onResume={() => setIsTimerPaused(false)}
              onStop={handleStopTimer}
              onUpdateSetWeight={updateSetWeight}
              onUpdateSetReps={updateSetReps}
              onCompleteSet={completeSet}
              onMarkSetAsFailure={markSetAsFailure}
              onDeleteSet={deleteSet}
              onAddSet={addSet}
              onFinish={finishWorkout}
            />
          )
        ) : (
          <>
            <WorkoutHeaderTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onAddPress={showAddOptions}
            />
            {activeTab === 'templates' ? (
              templates.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="barbell-outline" size={48} color="#D9D9D9" />
                  <Text style={styles.emptyStateText}>No templates yet</Text>
                </View>
              ) : (
                <TemplateList
                  templates={templates}
                  onEditTemplate={handleEditTemplate}
                  onDeleteTemplate={handleDeleteTemplate}
                  onStartWorkout={startWorkout}
                />
              )
            ) : (
              <WorkoutListView groupedWorkouts={groupedWorkouts} />
            )}
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 8,
  },
});

export default WorkoutScreen; 