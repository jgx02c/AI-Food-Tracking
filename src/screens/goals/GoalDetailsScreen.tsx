import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import GoalsService, { Goal } from '../services/goals';

const GoalDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { goalId } = route.params as { goalId: string };
  const [goal, setGoal] = useState<Goal | null>(null);

  useEffect(() => {
    loadGoal();
  }, [goalId]);

  const loadGoal = async () => {
    try {
      const goals = await GoalsService.getGoals();
      const foundGoal = goals.find(g => g.id === goalId);
      if (foundGoal) {
        setGoal(foundGoal);
      } else {
        Alert.alert('Error', 'Goal not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading goal:', error);
      Alert.alert('Error', 'Failed to load goal');
      navigation.goBack();
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await GoalsService.deleteGoal(goalId);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting goal:', error);
              Alert.alert('Error', 'Failed to delete goal');
            }
          },
        },
      ]
    );
  };

  if (!goal) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const progress = (goal.current / goal.target) * 100;
  const isCompleted = progress >= 100;
  const daysLeft = Math.ceil((new Date(goal.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#2C3E50" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={24} color="#E74C3C" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Ionicons 
            name={
              goal.type === 'food' ? 'restaurant-outline' :
              goal.type === 'workout' ? 'fitness-outline' :
              'scale-outline'
            } 
            size={32} 
            color="#2C3E50" 
          />
          <Text style={styles.title}>{goal.title}</Text>
        </View>

        <View style={[
          styles.categoryBadge,
          { backgroundColor: goal.category === 'maintenance' ? '#3498DB' : '#2ECC71' }
        ]}>
          <Text style={styles.categoryText}>{goal.category}</Text>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progress</Text>
            <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
          </View>
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

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={24} color="#7F8C8D" />
              <Text style={styles.detailLabel}>Frequency</Text>
              <Text style={styles.detailValue}>{goal.frequency}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={24} color="#7F8C8D" />
              <Text style={styles.detailLabel}>Days Left</Text>
              <Text style={styles.detailValue}>{daysLeft}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-number-outline" size={24} color="#7F8C8D" />
              <Text style={styles.detailLabel}>Start Date</Text>
              <Text style={styles.detailValue}>
                {new Date(goal.startDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="flag-outline" size={24} color="#7F8C8D" />
              <Text style={styles.detailLabel}>End Date</Text>
              <Text style={styles.detailValue}>
                {new Date(goal.endDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {isCompleted && (
          <View style={styles.completedCard}>
            <Ionicons name="checkmark-circle" size={32} color="#2ECC71" />
            <Text style={styles.completedText}>Goal Completed!</Text>
          </View>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 4,
  },
  deleteButton: {
    padding: 8,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 12,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 24,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  progressCard: {
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
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2ECC71',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ECF0F1',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2ECC71',
  },
  progressText: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  detailsCard: {
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  completedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2ECC71',
    marginTop: 12,
  },
});

export default GoalDetailsScreen; 