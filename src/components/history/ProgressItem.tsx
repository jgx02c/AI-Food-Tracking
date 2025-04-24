import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressItemProps } from '../../types/components';

const ProgressItem = ({ label, current, goal, unit = '' }: ProgressItemProps) => {
  const getProgressColor = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage > 100) return '#A67356';
    if (percentage > 90) return '#829AAF';
    return '#739E82';
  };

  return (
    <View style={styles.progressItem}>
      <Text style={styles.progressLabel}>{label}</Text>
      <Text style={[styles.progressValue, { 
        color: getProgressColor(current, goal)
      }]}>
        {current}{unit} / {goal}{unit}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  progressItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F5F5F0',
    padding: 12,
    borderRadius: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#829AAF',
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProgressItem; 