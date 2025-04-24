import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WorkoutTemplate, ActiveWorkout } from '../../types/workout';
import { StorageService } from '../../services/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutStackParamList } from '../../navigation/WorkoutStack';
import WorkoutTemplateEditor from '../../components/workout/WorkoutTemplateEditor';

type WorkoutScreenNavigationProp = NativeStackNavigationProp<WorkoutStackParamList>;

const WorkoutHomeScreen = () => {
  const navigation = useNavigation<WorkoutScreenNavigationProp>();
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(null);
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
    ]);
  };

  const loadTemplates = async () => {
    const savedTemplates = await StorageService.getWorkoutTemplates();
    setTemplates(savedTemplates);
  };

  const loadActiveWorkout = async () => {
    try {
      const storedWorkout = await AsyncStorage.getItem('activeWorkout');
      if (storedWorkout) {
        const parsedWorkout = JSON.parse(storedWorkout);
        // Convert string dates back to Date objects
        parsedWorkout.startTime = new Date(parsedWorkout.startTime);
        if (parsedWorkout.endTime) {
          parsedWorkout.endTime = new Date(parsedWorkout.endTime);
        }
        setActiveWorkout(parsedWorkout);
      }
    } catch (error) {
      console.error('Error loading active workout:', error);
      setActiveWorkout(null);
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
      await AsyncStorage.setItem('activeWorkout', JSON.stringify(workoutWithState));
      setActiveWorkout(workoutWithState);
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Workouts</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleEditTemplate()}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
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
          </TouchableOpacity>
        )}

        <View style={styles.templatesContainer}>
          {templates.map((template) => (
            <TouchableOpacity
              key={template.id}
              style={styles.templateCard}
              onPress={() => handleStartWorkout(template)}
            >
              <View style={styles.templateHeader}>
                <Text style={styles.templateName}>{template.name}</Text>
                <View style={styles.templateActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditTemplate(template)}
                  >
                    <Ionicons name="pencil" size={20} color="#1E4D6B" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteTemplate(template.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#E74C3C" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.templateDetails}>
                {template.exercises.length} exercises
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
    fontWeight: '600',
    color: '#2C3E50',
  },
  addButton: {
    backgroundColor: '#1E4D6B',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeWorkoutCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
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
  },
  templatesContainer: {
    padding: 16,
  },
  templateCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  templateName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  templateActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
  templateDetails: {
    fontSize: 14,
    color: '#7F8C8D',
  },
});

export default WorkoutHomeScreen; 