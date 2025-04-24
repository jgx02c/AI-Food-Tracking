import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WorkoutTemplate, ActiveWorkout } from '../../types/workout';
import { StorageService } from '../../services/storage';
import { WorkoutStackParamList } from '../../navigation/WorkoutStack';
import { format } from 'date-fns';
import WorkoutTemplateEditor from '../../components/workout/WorkoutTemplateEditor';

type WorkoutScreenNavigationProp = NativeStackNavigationProp<WorkoutStackParamList>;
type TabType = 'templates' | 'history';

const WorkoutHomeScreen = () => {
  const navigation = useNavigation<WorkoutScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<TabType>('templates');
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(null);
  const [completedWorkouts, setCompletedWorkouts] = useState<ActiveWorkout[]>([]);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | undefined>();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      loadTemplates(),
      loadActiveWorkout(),
      loadCompletedWorkouts(),
    ]);
  };

  const loadTemplates = async () => {
    const savedTemplates = await StorageService.getWorkoutTemplates();
    setTemplates(savedTemplates);
  };

  const loadActiveWorkout = async () => {
    try {
      const workout = await StorageService.getActiveWorkout();
      setActiveWorkout(workout);
    } catch (error) {
      console.error('Error loading active workout:', error);
      setActiveWorkout(null);
    }
  };

  const loadCompletedWorkouts = async () => {
    try {
      const workouts = await StorageService.getCompletedWorkouts();
      setCompletedWorkouts(workouts);
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
      await StorageService.saveWorkoutTemplate(template);
      const updatedTemplates = await StorageService.getWorkoutTemplates();
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
      const workoutWithState = {
        id: Date.now().toString(),
        templateId: template.id,
        template,
        startTime: new Date(),
        status: 'inProgress' as const,
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

  const renderTemplatesTab = () => (
    <View style={styles.tabContent}>
      {templates.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="barbell-outline" size={48} color="#BDC3C7" />
          <Text style={styles.emptyStateText}>No templates yet</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => handleEditTemplate()}
          >
            <Text style={styles.createButtonText}>Create Your First Template</Text>
          </TouchableOpacity>
        </View>
      ) : (
        templates.map((template) => (
          <TouchableOpacity
            key={template.id}
            style={styles.card}
            onPress={() => handleStartWorkout(template)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{template.name}</Text>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEditTemplate(template)}
                >
                  <Ionicons name="pencil" size={20} color="#1E4D6B" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteTemplate(template.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#E74C3C" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.cardDetails}>
              {template.exercises.length} exercises
            </Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  const renderHistoryTab = () => (
    <View style={styles.tabContent}>
      {completedWorkouts.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="fitness-outline" size={48} color="#BDC3C7" />
          <Text style={styles.emptyStateText}>No completed workouts yet</Text>
        </View>
      ) : (
        completedWorkouts.map((workout) => (
          <TouchableOpacity
            key={workout.id}
            style={styles.card}
            onPress={() => navigation.navigate('WorkoutDetails', { workoutId: workout.id })}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{workout.template.name}</Text>
              <Ionicons name="chevron-forward" size={20} color="#7F8C8D" />
            </View>
            <Text style={styles.cardDate}>
              {format(new Date(workout.startTime), 'MMM d, yyyy')}
            </Text>
            <Text style={styles.cardDetails}>
              {workout.template.exercises.length} exercises
            </Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Workouts</Text>
        {activeTab === 'templates' && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleEditTemplate()}
          >
            <Ionicons name="add-circle-outline" size={24} color="#1E4D6B" />
          </TouchableOpacity>
        )}
      </View>

      {activeWorkout && (
        <TouchableOpacity
          style={styles.activeWorkoutCard}
          onPress={() => navigation.navigate('ActiveWorkout')}
        >
          <View style={styles.activeWorkoutHeader}>
            <Text style={styles.activeWorkoutTitle}>Active Workout</Text>
            <Ionicons name="chevron-forward" size={24} color="#2C3E50" />
          </View>
          <Text style={styles.activeWorkoutName}>{activeWorkout.template.name}</Text>
          <Text style={styles.activeWorkoutTime}>
            Started at {format(new Date(activeWorkout.startTime), 'h:mm a')}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'templates' && styles.activeTab]}
          onPress={() => setActiveTab('templates')}
        >
          <Text style={[styles.tabText, activeTab === 'templates' && styles.activeTabText]}>
            Templates
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'templates' ? renderTemplatesTab() : renderHistoryTab()}
      </ScrollView>

      {showTemplateEditor && (
        <WorkoutTemplateEditor
          template={editingTemplate}
          onSave={handleSaveTemplate}
          onCancel={() => {
            setShowTemplateEditor(false);
            setEditingTemplate(undefined);
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  addButton: {
    padding: 8,
  },
  activeWorkoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeWorkoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeWorkoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2ECC71',
  },
  activeWorkoutName: {
    fontSize: 18,
    color: '#2C3E50',
    marginBottom: 4,
  },
  activeWorkoutTime: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1E4D6B',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#7F8C8D',
  },
  activeTabText: {
    color: '#1E4D6B',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  tabContent: {
    flex: 1,
  },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  cardDate: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  cardDetails: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 8,
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#1E4D6B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WorkoutHomeScreen; 