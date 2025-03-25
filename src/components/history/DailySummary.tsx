import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FoodEntry } from '../../types';
import { ActiveWorkout } from '../../types/workout';
import StreakCard from './StreakCard';
import ProgressItem from './ProgressItem';
import FoodEntryCard from './FoodEntryCard';
import WorkoutCard from './WorkoutCard';

interface DailySummaryProps {
  date: Date;
  foodEntries: FoodEntry[];
  workouts: ActiveWorkout[];
  streak: number;
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const DailySummary = ({ date, foodEntries, workouts, streak, goals }: DailySummaryProps) => {
  const totalCalories = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalProtein = foodEntries.reduce((sum, entry) => sum + entry.protein, 0);
  const totalCarbs = foodEntries.reduce((sum, entry) => sum + entry.carbs, 0);
  const totalFat = foodEntries.reduce((sum, entry) => sum + entry.fat, 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.streakContainer}>
        <StreakCard label="Current Streak" value={streak} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Progress</Text>
        <View style={styles.progressContainer}>
          <ProgressItem
            label="Calories"
            current={totalCalories}
            goal={goals.calories}
            unit="kcal"
          />
          <ProgressItem
            label="Protein"
            current={totalProtein}
            goal={goals.protein}
            unit="g"
          />
          <ProgressItem
            label="Carbs"
            current={totalCarbs}
            goal={goals.carbs}
            unit="g"
          />
          <ProgressItem
            label="Fat"
            current={totalFat}
            goal={goals.fat}
            unit="g"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Food Entries</Text>
        {foodEntries.length === 0 ? (
          <Text style={styles.emptyText}>No food entries for this day</Text>
        ) : (
          foodEntries.map((entry, index) => (
            <FoodEntryCard key={index} entry={entry} />
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Workouts</Text>
        {workouts.length === 0 ? (
          <Text style={styles.emptyText}>No workouts for this day</Text>
        ) : (
          workouts.map((workout, index) => (
            <WorkoutCard key={index} workout={workout} />
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  streakContainer: {
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3D4F',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#829AAF',
    textAlign: 'center',
    padding: 16,
  },
});

export default DailySummary; 