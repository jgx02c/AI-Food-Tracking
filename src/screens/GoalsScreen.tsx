import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import GoalsService, { Goal } from '../services/goals';

const GoalsScreen = () => {
  const navigation = useNavigation();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadGoals = async () => {
    try {
      const loadedGoals = await GoalsService.getGoals();
      setGoals(loadedGoals);
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGoals();
    setRefreshing(false);
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const renderGoalCard = (goal: Goal) => {
    const progress = (goal.current / goal.target) * 100;
    const isCompleted = progress >= 100;

    return (
      <TouchableOpacity 
        key={goal.id}
        style={styles.goalCard}
        onPress={() => navigation.navigate('GoalDetails', { goalId: goal.id })}
      >
        <View style={styles.goalHeader}>
          <View style={styles.goalTitleContainer}>
            <Ionicons 
              name={
                goal.type === 'food' ? 'restaurant-outline' :
                goal.type === 'workout' ? 'fitness-outline' :
                'scale-outline'
              } 
              size={24} 
              color="#2C3E50" 
            />
            <Text style={styles.goalTitle}>{goal.title}</Text>
          </View>
          <View style={[
            styles.categoryBadge,
            { backgroundColor: goal.category === 'maintenance' ? '#3498DB' : '#2ECC71' }
          ]}>
            <Text style={styles.categoryText}>{goal.category}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${Math.min(progress, 100)}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {goal.current} / {goal.target} {goal.unit}
          </Text>
        </View>

        <View style={styles.goalFooter}>
          <View style={styles.frequencyContainer}>
            <Ionicons name="calendar-outline" size={16} color="#7F8C8D" />
            <Text style={styles.frequencyText}>{goal.frequency}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Ionicons name="time-outline" size={16} color="#7F8C8D" />
            <Text style={styles.dateText}>
              {new Date(goal.endDate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {isCompleted && (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={styles.completedText}>Completed</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Goals</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateGoal')}
        >
          <Ionicons name="add-circle-outline" size={24} color="#1E4D6B" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {goals.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="flag-outline" size={48} color="#BDC3C7" />
            <Text style={styles.emptyStateText}>No goals yet</Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => navigation.navigate('CreateGoal')}
            >
              <Text style={styles.createButtonText}>Create Your First Goal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          goals.map(renderGoalCard)
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F0',
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
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  goalCard: {
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
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1E4D6B',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  frequencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  frequencyText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#7F8C8D',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#7F8C8D',
  },
  completedBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2ECC71',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  completedText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
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

export default GoalsScreen; 