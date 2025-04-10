import React from 'react';
import { Alert } from 'react-native';
import { WorkoutTemplate, ActiveWorkout } from '../../types/workout';
import { StorageService } from '../../services/storage';
import { showActionSheet } from '../../utils/ActionSheet';

interface WorkoutManagerProps {
  templates: WorkoutTemplate[];
  activeWorkout: ActiveWorkout | null;
  onTemplatesChange: (templates: WorkoutTemplate[]) => void;
  onActiveWorkoutChange: (workout: ActiveWorkout | null) => void;
  onShowTemplateEditor: (template?: WorkoutTemplate) => void;
  onShowCompletionScreen: (show: boolean) => void;
  onActiveTabChange: (tab: 'templates' | 'workouts') => void;
}

const WorkoutManager: React.FC<WorkoutManagerProps> = ({
  templates,
  activeWorkout,
  onTemplatesChange,
  onActiveWorkoutChange,
  onShowTemplateEditor,
  onShowCompletionScreen,
  onActiveTabChange,
}) => {
  const handleEditTemplate = (template: WorkoutTemplate) => {
    onShowTemplateEditor(template);
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
            onTemplatesChange(updatedTemplates);
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
    onActiveWorkoutChange(newWorkout);
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
      onActiveWorkoutChange(completedWorkout);
      onShowCompletionScreen(true);
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
    onShowCompletionScreen(false);
    onActiveWorkoutChange(null);
    onActiveTabChange('workouts'); // Switch to workouts tab to show the completed workout
  };

  const cancelWorkout = async () => {
    if (!activeWorkout) return;

    const cancelledWorkout: ActiveWorkout = {
      ...activeWorkout,
      endTime: new Date(),
      status: 'cancelled' as const,
    };
    onActiveWorkoutChange(cancelledWorkout);
    await StorageService.saveActiveWorkout(cancelledWorkout);
    onActiveWorkoutChange(null);
  };

  const showAddOptions = () => {
    showActionSheet(
      {
        options: ['Cancel', 'Add Template'],
        cancelButtonIndex: 0,
      },
      (buttonIndex: number) => {
        if (buttonIndex === 1) {
          onShowTemplateEditor(undefined);
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
            onActiveTabChange('templates'); // Switch back to templates tab
          },
        },
      ]
    );
  };

  return null; // This is a logic-only component, no UI
};

export default WorkoutManager; 