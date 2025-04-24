import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WeightSectionProps } from '../../types/components';

const WeightSection = ({ currentWeight, targetWeight, onPress }: WeightSectionProps) => {
  if (currentWeight === undefined || currentWeight === null || currentWeight === '') {
    return <Text style={styles.emptyText}>No weight added today</Text>;
  }

  const current = parseFloat(currentWeight) || 0;
  const target = parseFloat(targetWeight) || 0;
  const progress = target > 0 ? (current / target) * 100 : 0;

  return (
    <TouchableOpacity 
      style={styles.goalCard}
      onPress={onPress}
    >
      <View style={styles.goalHeader}>
        <View style={styles.goalTitleContainer}>
          <Ionicons 
            name="scale-outline"
            size={20} 
            color="#2C3E50" 
          />
          <Text style={styles.goalTitle}>Today's Weight</Text>
        </View>
        {target > 0 && (
          <Text style={styles.goalProgress}>
            {Math.round(progress)}%
          </Text>
        )}
      </View>
      {target > 0 && (
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${Math.min(progress, 100)}%` }
            ]} 
          />
        </View>
      )}
      <Text style={styles.goalDetails}>
        {current} kg
        {target > 0 && ` / ${targetWeight} kg`}
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
  emptyText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'left',
  },
});

export default WeightSection; 