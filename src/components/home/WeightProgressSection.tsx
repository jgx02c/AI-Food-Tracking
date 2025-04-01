import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WeightSection from './WeightSection';
import { WeightProgressSectionProps } from '../../types/home';

const WeightProgressSection = ({ currentWeight, targetWeight, onPress }: WeightProgressSectionProps) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Weight Progress</Text>
      <WeightSection 
        currentWeight={currentWeight}
        targetWeight={targetWeight}
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
  emptyText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    padding: 16,
  },
});

export default WeightProgressSection; 