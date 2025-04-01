import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GoalCardProps } from '../../types/goals';

const GoalCard = ({ goal, onPress }: GoalCardProps) => {
  const progress = (goal.current / goal.target) * 100;

  return (
    <TouchableOpacity 
      style={styles.goalCard}
      onPress={() => onPress(goal.id)}
    >
      <View style={styles.goalHeader}>
        <View style={styles.goalTitleContainer}>
          <Ionicons 
            name={
              goal.type === 'food' ? 'restaurant-outline' :
              goal.type === 'workout' ? 'fitness-outline' :
              'scale-outline'
            } 
            size={20} 
            color="#2C3E50" 
          />
          <Text style={styles.goalTitle}>{goal.title}</Text>
        </View>
        <Text style={styles.goalProgress}>
          {Math.round(progress)}%
        </Text>
      </View>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill,
            { width: `${Math.min(progress, 100)}%` }
          ]} 
        />
      </View>
      <Text style={styles.goalDetails}>
        {goal.current} / {goal.target} {goal.unit}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
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
    marginBottom: 8,
  },
  goalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 8,
  },
  goalProgress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F8F9FA',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1E4D6B',
    borderRadius: 3,
  },
  goalDetails: {
    fontSize: 12,
    color: '#7F8C8D',
  },
});

export default GoalCard; 