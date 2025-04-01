import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  ActionSheetIOS,
  TouchableOpacity,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import WorkoutHeaderTabs from '../components/workout/WorkoutHeaderTabs';
import WorkoutListView from '../components/workout/WorkoutListView';
import WorkoutTemplateEditor from '../components/workout/WorkoutTemplateEditor';
import { WorkoutStackParamList } from '../navigation/WorkoutStack';
import { WorkoutTemplate, ActiveWorkout } from '../types/workout';
import { StorageService } from '../services/storage';

type TabType = 'templates' | 'workouts';
type WorkoutScreenNavigationProp = NativeStackNavigationProp<WorkoutStackParamList>;

const WorkoutScreen = () => {
  const navigation = useNavigation<WorkoutScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<TabType>('templates');
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | undefined>();
  const [completedWorkouts, setCompletedWorkouts] = useState<ActiveWorkout[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      loadTemplates(),
      loadCompletedWorkouts(),
    ]);
  };

  const loadTemplates = async () => {
    console.log('Loading templates...');
    const savedTemplates = await StorageService.getWorkoutTemplates();
    console.log('Loaded templates:', savedTemplates);
    setTemplates(savedTemplates);
  };

  const loadCompletedWorkouts = async (page: number = 1) => {
    try {
      const workouts = await StorageService.getCompletedWorkouts();
      // Convert string dates back to Date objects
      const parsedWorkouts = workouts.map(workout => ({
        ...workout,
        startTime: new Date(workout.startTime),
        endTime: workout.endTime ? new Date(workout.endTime) : undefined,
      }));
      setCompletedWorkouts(parsedWorkouts);
      setHasMore(false); // Since we're loading all at once for now
    } catch (error) {
      console.error('Error loading completed workouts:', error);
    }
  };

  const handleEditTemplate = (template?: WorkoutTemplate) => {
    setEditingTemplate(template);
    setShowTemplateEditor(true);
  };

  const handleSaveTemplate = async (template: WorkoutTemplate) => {
    try {
      console.log('Saving template in WorkoutScreen:', template);
      await StorageService.saveWorkoutTemplate(template);
      console.log('Template saved, fetching updated templates...');
      const updatedTemplates = await StorageService.getWorkoutTemplates();
      console.log('Updated templates:', updatedTemplates);
      setTemplates(updatedTemplates);
      setShowTemplateEditor(false);
      setEditingTemplate(undefined);
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    await StorageService.deleteWorkoutTemplate(templateId);
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(updatedTemplates);
  };

  const handleStartWorkout = async (template: WorkoutTemplate) => {
    try {
      const workoutWithState: ActiveWorkout = {
        id: Date.now().toString(),
        templateId: template.id,
        template,
        startTime: new Date(),
        status: 'inProgress',
        exercises: template.exercises.map(exercise => ({
          ...exercise,
          sets: exercise.sets.map(set => ({
            ...set,
            actualWeight: undefined,
            actualReps: undefined,
            completed: false,
            isFailure: false,
          })),
        })),
      };
      await StorageService.saveActiveWorkout(workoutWithState);
      navigation.navigate('ActiveWorkout');
    } catch (error) {
      console.error('Error starting workout:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (showTemplateEditor) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => setShowTemplateEditor(false)}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <Text style={styles.title}>
            {editingTemplate ? 'Edit Template' : 'New Template'}
          </Text>
        </View>
        <WorkoutTemplateEditor
          template={editingTemplate}
          onSave={handleSaveTemplate}
          onCancel={() => {
            setShowTemplateEditor(false);
            setEditingTemplate(undefined);
          }}
        />
      </SafeAreaView>
    );
  }

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

        <WorkoutListView
          activeTab={activeTab}
          templates={templates}
          completedWorkouts={completedWorkouts}
          hasMore={hasMore}
          refreshing={refreshing}
          onLoadMore={() => loadCompletedWorkouts(1)}
          onRefresh={onRefresh}
          onEditTemplate={handleEditTemplate}
          onDeleteTemplate={handleDeleteTemplate}
          onStartWorkout={handleStartWorkout}
          onCreateTemplate={() => {
            setEditingTemplate(undefined);
            setShowTemplateEditor(true);
          }}
          onTabChange={setActiveTab}
        />
      </View>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
  },
});

export default WorkoutScreen; 