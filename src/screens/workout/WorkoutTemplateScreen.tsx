import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WorkoutTemplate } from '../../types/workout';
import { StorageService } from '../../services/storage';
import { WorkoutStackParamList } from '../../navigation/WorkoutStack';
import WorkoutTemplateEditor from '../../components/workout/WorkoutTemplateEditor';

type WorkoutTemplateScreenNavigationProp = NativeStackNavigationProp<WorkoutStackParamList>;

const WorkoutTemplateScreen = () => {
  const navigation = useNavigation<WorkoutTemplateScreenNavigationProp>();
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | undefined>();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const savedTemplates = await StorageService.getWorkoutTemplates();
    setTemplates(savedTemplates);
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
    await loadTemplates();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#2C3E50" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Workout Templates</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleEditTemplate()}
        >
          <Ionicons name="add" size={24} color="#1E4D6B" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.templatesContainer}>
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
            ))
          )}
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
  contentContainer: {
    padding: 16,
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    marginLeft: 4,
    color: '#2C3E50',
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  templatesContainer: {
    flex: 1,
  },
  templateCard: {
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

export default WorkoutTemplateScreen; 