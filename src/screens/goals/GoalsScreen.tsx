import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import GoalsService, { Goal } from '../../services/goals';
import GoalList from '../../components/goals/GoalList';
import GoalForm from '../../components/goals/GoalForm';
import GoalDetails from '../../components/goals/GoalDetails';
import { GoalFormData } from '../../types/goals';

const GoalsScreen = () => {
  const navigation = useNavigation();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleAddGoal = () => {
    setIsEditing(false);
    setSelectedGoal(null);
    setShowForm(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setIsEditing(true);
    setSelectedGoal(goal);
    setShowForm(true);
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await GoalsService.deleteGoal(goalId);
      await loadGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const handleUpdateGoal = async (goalId: string, data: Partial<GoalFormData>) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;

      const { target, ...restData } = data;
      const updatedGoal: Goal = {
        ...goal,
        ...restData,
        target: target ? Number(target) : goal.target,
        isActive: goal.isActive,
      };
      await GoalsService.saveGoal(updatedGoal);
      await loadGoals();
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleSubmitForm = async (formData: GoalFormData) => {
    try {
      if (isEditing && selectedGoal) {
        await handleUpdateGoal(selectedGoal.id, formData);
      } else {
        const { target, ...restData } = formData;
        const newGoal: Goal = {
          id: Date.now().toString(),
          current: 0,
          isActive: true,
          target: Number(target),
          ...restData,
        };
        await GoalsService.saveGoal(newGoal);
        await loadGoals();
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const handleGoalPress = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      setSelectedGoal(goal);
    }
  };

  const renderGoalCard = (goal: Goal) => {
    const progress = (goal.current / goal.target) * 100;
    const isCompleted = progress >= 100;

    return (
      <TouchableOpacity
        key={goal.id}
        style={styles.goalCard}
        onPress={() => handleGoalPress(goal.id)}
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
          <View style={styles.goalStatusContainer}>
            <View style={[
              styles.categoryBadge,
              { backgroundColor: goal.category === 'maintenance' ? '#3498DB' : '#2ECC71' }
            ]}>
              <Text style={styles.categoryText}>{goal.category}</Text>
            </View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: goal.isActive ? '#2ECC71' : '#BDC3C7' }
            ]}>
              <Text style={styles.statusText}>
                {goal.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
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

  if (showForm) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => setShowForm(false)}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setIsEditing(!isEditing)}
            style={styles.editButton}
          >
            <Ionicons 
              name={isEditing ? "checkmark" : "pencil"} 
              size={24} 
              color="#2C3E50" 
            />
          </TouchableOpacity>
        </View>
        <GoalForm
          onSubmit={handleSubmitForm}
          initialData={selectedGoal ? {
            ...selectedGoal,
            target: selectedGoal.target.toString(),
          } : undefined}
          isEditing={isEditing}
        />
      </SafeAreaView>
    );
  }

  if (selectedGoal) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => setSelectedGoal(null)}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleEditGoal(selectedGoal)}
            style={styles.editButton}
          >
            <Ionicons name="pencil" size={24} color="#2C3E50" />
          </TouchableOpacity>
        </View>
        <GoalDetails
          goal={selectedGoal}
          onUpdate={handleUpdateGoal}
          onDelete={handleDeleteGoal}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Goals</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddGoal}
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
              onPress={handleAddGoal}
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
  backButton: {
    padding: 8,
  },
  editButton: {
    padding: 8,
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
  goalStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
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