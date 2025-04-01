import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StatsSection from './StatsSection';
import { StatsProgressSectionProps } from '../../types/home';

const StatsProgressSection = ({ stats, goals }: StatsProgressSectionProps) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Today's Stats</Text>
      <StatsSection 
        stats={stats}
        goals={goals}
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

export default StatsProgressSection; 