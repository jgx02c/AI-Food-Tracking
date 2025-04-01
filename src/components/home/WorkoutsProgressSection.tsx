import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WorkoutsSection from './WorkoutsSection';
import { WorkoutsProgressSectionProps } from '../../types/home';

const WorkoutsProgressSection = ({ todayWorkouts, completedWorkouts, onPress }: WorkoutsProgressSectionProps) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Today's Workouts</Text>
      <WorkoutsSection 
        todayWorkouts={todayWorkouts}
        completedWorkouts={completedWorkouts}
        onPress={onPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
});

export default WorkoutsProgressSection; 