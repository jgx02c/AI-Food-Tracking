import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatsSectionProps } from '../../types/components';

const StatsSection = ({ stats, goals }: StatsSectionProps) => {
  const getProgressColor = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage > 100) return '#A67356'; // Warm Cognac
    if (percentage > 90) return '#829AAF'; // Muted Steel Blue
    return '#739E82'; // Sage Green
  };

  const getProgressMessage = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage > 100) return 'Over goal';
    if (percentage > 90) return 'Almost there!';
    if (percentage > 70) return 'On track';
    if (percentage > 50) return 'Keep going';
    return 'Need to catch up';
  };

  return (
    <View style={styles.container}>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Calories</Text>
        <Text style={styles.statValue}>{stats.calories}</Text>
        <Text style={styles.statGoal}>Goal: {goals.calories}</Text>
        <Text style={[styles.progressMessage, { color: getProgressColor(stats.calories, parseInt(goals.calories)) }]}>
          {getProgressMessage(stats.calories, parseInt(goals.calories))}
        </Text>
        <View style={[styles.progressBar, { backgroundColor: getProgressColor(stats.calories, parseInt(goals.calories)) }]} />
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Protein</Text>
        <Text style={styles.statValue}>{stats.protein}g</Text>
        <Text style={styles.statGoal}>Goal: {goals.protein}g</Text>
        <Text style={[styles.progressMessage, { color: getProgressColor(stats.protein, parseInt(goals.protein)) }]}>
          {getProgressMessage(stats.protein, parseInt(goals.protein))}
        </Text>
        <View style={[styles.progressBar, { backgroundColor: getProgressColor(stats.protein, parseInt(goals.protein)) }]} />
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Carbs</Text>
        <Text style={styles.statValue}>{stats.carbs}g</Text>
        <Text style={styles.statGoal}>Goal: {goals.carbs}g</Text>
        <Text style={[styles.progressMessage, { color: getProgressColor(stats.carbs, parseInt(goals.carbs)) }]}>
          {getProgressMessage(stats.carbs, parseInt(goals.carbs))}
        </Text>
        <View style={[styles.progressBar, { backgroundColor: getProgressColor(stats.carbs, parseInt(goals.carbs)) }]} />
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Fat</Text>
        <Text style={styles.statValue}>{stats.fat}g</Text>
        <Text style={styles.statGoal}>Goal: {goals.fat}g</Text>
        <Text style={[styles.progressMessage, { color: getProgressColor(stats.fat, parseInt(goals.fat)) }]}>
          {getProgressMessage(stats.fat, parseInt(goals.fat))}
        </Text>
        <View style={[styles.progressBar, { backgroundColor: getProgressColor(stats.fat, parseInt(goals.fat)) }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  statGoal: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  progressMessage: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
});

export default StatsSection; 