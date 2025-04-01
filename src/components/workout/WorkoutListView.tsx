import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutTemplate, ActiveWorkout } from '../../types/workout';
import TemplateList from './TemplateList';
import WorkoutHistoryList from './WorkoutHistoryList';
import { isToday, isYesterday, isThisWeek } from 'date-fns';

interface WorkoutListViewProps {
  activeTab: 'templates' | 'workouts';
  templates: WorkoutTemplate[];
  completedWorkouts: ActiveWorkout[];
  hasMore: boolean;
  refreshing: boolean;
  onLoadMore: () => void;
  onRefresh: () => void;
  onEditTemplate: (template?: WorkoutTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
  onStartWorkout: (template: WorkoutTemplate) => void;
  onCreateTemplate: () => void;
  onTabChange: (tab: 'templates' | 'workouts') => void;
}

const WorkoutListView: React.FC<WorkoutListViewProps> = ({
  activeTab,
  templates,
  completedWorkouts,
  hasMore,
  refreshing,
  onLoadMore,
  onRefresh,
  onEditTemplate,
  onDeleteTemplate,
  onStartWorkout,
  onCreateTemplate,
  onTabChange,
}) => {
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
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {activeTab === 'templates' ? (
        templates.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="barbell-outline" size={48} color="#BDC3C7" />
            <Text style={styles.emptyStateText}>No templates yet</Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={onCreateTemplate}
            >
              <Text style={styles.createButtonText}>Create Your First Template</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TemplateList
            templates={templates}
            onEditTemplate={onEditTemplate}
            onDeleteTemplate={onDeleteTemplate}
            onStartWorkout={onStartWorkout}
          />
        )
      ) : (
        completedWorkouts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="fitness-outline" size={48} color="#BDC3C7" />
            <Text style={styles.emptyStateText}>No workouts completed yet</Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => onTabChange('templates')}
            >
              <Text style={styles.createButtonText}>Create a Template and Start Working Out</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <WorkoutHistoryList
            groupedWorkouts={groupedWorkouts}
            onLoadMore={onLoadMore}
            hasMore={hasMore}
          />
        )
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    flex: 1,
    minHeight: 400,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  createButton: {
    backgroundColor: '#1E4D6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default WorkoutListView; 