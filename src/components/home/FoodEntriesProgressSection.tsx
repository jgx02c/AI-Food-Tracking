import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FoodEntriesSection from './FoodEntriesSection';
import { FoodEntriesProgressSectionProps } from '../../types/home';

const FoodEntriesProgressSection = ({ entries, onPress }: FoodEntriesProgressSectionProps) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Today's Food</Text>
      <FoodEntriesSection 
        entries={entries}
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

export default FoodEntriesProgressSection; 