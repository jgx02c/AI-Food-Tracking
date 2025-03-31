import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
import SetManager from '../components/workout/SetManager';
import WorkoutManager from '../components/workout/WorkoutManager';
import { format, isToday, isYesterday, isThisWeek } from 'date-fns';
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 20;

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

  const loadCompletedWorkouts = async (pageNum: number = 1) => {
    try {
      const allWorkouts = await StorageService.getCompletedWorkouts();
      // Filter out deleted workouts and sort by date
      const validWorkouts = allWorkouts
        .filter(workout => workout && workout.template)
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

      // Calculate pagination
      const startIndex = (pageNum - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedWorkouts = validWorkouts.slice(startIndex, endIndex);
      
      setHasMore(endIndex < validWorkouts.length);
      setCompletedWorkouts(prev => pageNum === 1 ? paginatedWorkouts : [...prev, ...paginatedWorkouts]);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading completed workouts:', error);
    }
  };

  const handleLoadMore = () => {
    if (!hasMore) return;
    loadCompletedWorkouts(page + 1);
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

  const handleUpdateWorkout = async (updatedWorkout: ActiveWorkout) => {
    setActiveWorkout(updatedWorkout);
    await StorageService.saveActiveWorkout(updatedWorkout);
  };

  // Group completed workouts by time period
  const groupedWorkouts = {
    today: completedWorkouts.filter(workout => isToday(new Date(workout.startTime))),
    yesterday: completedWorkouts.filter(workout => isYesterday(new Date(workout.startTime))),
    pastWeek: completedWorkouts.filter(workout => 
      isThisWeek(new Date(workout.startTime)) && 
      !isToday(new Date(workout.startTime)) && 
      !isYesterday(new Date(workout.startTime))
    ),
    older: completedWorkouts.filter(workout => 
      !isThisWeek(new Date(workout.startTime))
    ),
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F0" />
      <View style={styles.container}>
        <WorkoutHeaderTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onAddPress={() => {
            if (Platform.OS === 'ios') {
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
            }
          }}
        />
        
        <SetManager
          activeWorkout={activeWorkout}
          onUpdateWorkout={handleUpdateWorkout}
        />

        <WorkoutManager
          templates={templates}
          activeWorkout={activeWorkout}
          onTemplatesChange={setTemplates}
          onActiveWorkoutChange={setActiveWorkout}
          onShowTemplateEditor={(template) => {
            setEditingTemplate(template);
            setShowTemplateEditor(true);
          }}
          onShowCompletionScreen={setShowCompletionScreen}
          onActiveTabChange={setActiveTab}
        />

        {activeWorkout ? (
          showCompletionScreen ? (
            <WorkoutCompletionScreen
              workout={activeWorkout}
              onFinish={() => {
                setShowCompletionScreen(false);
                setActiveWorkout(null);
                loadCompletedWorkouts(1); // Reset to first page when completing a workout
                setActiveTab('workouts'); // Switch to workouts tab to show the completed workout
              }}
            />
          ) : (
            <ActiveWorkoutView
              workout={activeWorkout}
              onFinish={async () => {
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
                }
              }}
              isTimerPaused={isTimerPaused}
              onPause={() => setIsTimerPaused(true)}
              onResume={() => setIsTimerPaused(false)}
              onStop={() => {
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
                      onPress: async () => {
                        if (!activeWorkout) return;

                        const cancelledWorkout: ActiveWorkout = {
                          ...activeWorkout,
                          endTime: new Date(),
                          status: 'cancelled' as const,
                        };
                        setActiveWorkout(cancelledWorkout);
                        await StorageService.saveActiveWorkout(cancelledWorkout);
                        setActiveWorkout(null);
                        setActiveTab('templates'); // Switch back to templates tab
                      },
                    },
                  ]
                );
              }}
              onUpdateSetWeight={(exerciseIndex, setIndex, weight) => {
                const updatedExercises = [...activeWorkout.exercises];
                updatedExercises[exerciseIndex].sets[setIndex].actualWeight = weight;
                handleUpdateWorkout({ ...activeWorkout, exercises: updatedExercises });
              }}
              onUpdateSetReps={(exerciseIndex, setIndex, reps) => {
                const updatedExercises = [...activeWorkout.exercises];
                updatedExercises[exerciseIndex].sets[setIndex].actualReps = reps;
                handleUpdateWorkout({ ...activeWorkout, exercises: updatedExercises });
              }}
              onCompleteSet={(exerciseIndex, setIndex) => {
                const updatedExercises = [...activeWorkout.exercises];
                const set = updatedExercises[exerciseIndex].sets[setIndex];
                set.completed = !set.completed;
                if (!set.completed) set.isFailure = false;
                handleUpdateWorkout({ ...activeWorkout, exercises: updatedExercises });
              }}
              onMarkSetAsFailure={(exerciseIndex, setIndex) => {
                const updatedExercises = [...activeWorkout.exercises];
                const set = updatedExercises[exerciseIndex].sets[setIndex];
                set.isFailure = !set.isFailure;
                if (set.isFailure) set.completed = false;
                handleUpdateWorkout({ ...activeWorkout, exercises: updatedExercises });
              }}
              onDeleteSet={(exerciseIndex, setIndex) => {
                const updatedExercises = [...activeWorkout.exercises];
                updatedExercises[exerciseIndex].sets.splice(setIndex, 1);
                handleUpdateWorkout({ ...activeWorkout, exercises: updatedExercises });
              }}
              onAddSet={(exerciseIndex) => {
                const updatedExercises = [...activeWorkout.exercises];
                const exercise = updatedExercises[exerciseIndex];
                const lastSet = exercise.sets[exercise.sets.length - 1];
                exercise.sets.push({
                  ...lastSet,
                  actualWeight: undefined,
                  actualReps: undefined,
                  completed: false,
                  isFailure: false,
                });
                handleUpdateWorkout({ ...activeWorkout, exercises: updatedExercises });
              }}
            />
          )
        ) : (
          <ScrollView style={styles.content}>
            {activeTab === 'templates' ? (
              templates.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="barbell-outline" size={48} color="#D9D9D9" />
                  <Text style={styles.emptyStateText}>No templates yet</Text>
                </View>
              ) : (
                <TemplateList
                  templates={templates}
                  onEditTemplate={(template) => {
                    setEditingTemplate(template);
                    setShowTemplateEditor(true);
                  }}
                  onDeleteTemplate={async (templateId) => {
                    await StorageService.deleteWorkoutTemplate(templateId);
                    const updatedTemplates = templates.filter(t => t.id !== templateId);
                    setTemplates(updatedTemplates);
                  }}
                  onStartWorkout={async (template) => {
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
                  }}
                />
              )
            ) : (
              <WorkoutListView
                groupedWorkouts={groupedWorkouts}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
              />
            )}
          </ScrollView>
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
  content: {
    flex: 1,
  },
});

export default WorkoutScreen; 