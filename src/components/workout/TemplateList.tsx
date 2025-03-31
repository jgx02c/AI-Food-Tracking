import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutTemplate } from '../../types/workout';

interface TemplateListProps {
  templates: WorkoutTemplate[];
  onEditTemplate: (template: WorkoutTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
  onStartWorkout: (template: WorkoutTemplate) => void;
}

const TemplateList = ({ 
  templates, 
  onEditTemplate, 
  onDeleteTemplate, 
  onStartWorkout 
}: TemplateListProps) => {
  return (
    <ScrollView style={styles.container}>
      {templates.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No workout templates yet. Create one to get started!
          </Text>
        </View>
      ) : (
        templates.map((template) => (
          <View key={template.id} style={styles.templateCard}>
            <View style={styles.templateHeader}>
              <Text style={styles.templateName}>{template.name}</Text>
              <View style={styles.templateActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onEditTemplate(template)}
                >
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => onDeleteTemplate(template.id)}
                >
                  <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.templateDetails}>
              <Text style={styles.detailText}>
                {template.exercises.length} exercises
              </Text>
              <Text style={styles.detailText}>
                {template.calories} calories
              </Text>
            </View>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => onStartWorkout(template)}
            >
              <Text style={styles.startButtonText}>Start Workout</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
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
});

export default TemplateList; 