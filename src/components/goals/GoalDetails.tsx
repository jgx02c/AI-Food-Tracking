import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GoalDetailsProps } from '../../types/goals';

const GoalDetails = ({ goal, onUpdate, onDelete }: GoalDetailsProps) => {
  const progress = (goal.current / goal.target) * 100;

  const handleDelete = () => {
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
          onPress: () => onDelete(goal.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons 
            name={
              goal.type === 'food' ? 'restaurant-outline' :
              goal.type === 'workout' ? 'fitness-outline' :
              'scale-outline'
            } 
            size={24} 
            color="#2C3E50" 
          />
          <Text style={styles.title}>{goal.title}</Text>
        </View>
        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash-outline" size={24} color="#E74C3C" />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Progress: {Math.round(progress)}%
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${Math.min(progress, 100)}%` }
            ]} 
          />
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Current:</Text>
          <Text style={styles.detailValue}>{goal.current} {goal.unit}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Target:</Text>
          <Text style={styles.detailValue}>{goal.target} {goal.unit}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Frequency:</Text>
          <Text style={styles.detailValue}>{goal.frequency}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Category:</Text>
          <Text style={styles.detailValue}>{goal.category}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Start Date:</Text>
          <Text style={styles.detailValue}>
            {new Date(goal.startDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>End Date:</Text>
          <Text style={styles.detailValue}>
            {new Date(goal.endDate).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 12,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressText: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1E4D6B',
    borderRadius: 4,
  },
  detailsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  detailLabel: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  detailValue: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
});

export default GoalDetails; 