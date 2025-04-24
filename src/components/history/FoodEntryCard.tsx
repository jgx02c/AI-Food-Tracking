import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FoodEntryCardProps } from '../../types/components';

const FoodEntryCard = ({ entry }: FoodEntryCardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{entry.name}</Text>
      <View style={styles.details}>
        <Text style={styles.calories}>{entry.calories} cal</Text>
        <View style={styles.macros}>
          <Text style={styles.macro}>P: {entry.protein}g</Text>
          <Text style={styles.macro}>C: {entry.carbs}g</Text>
          <Text style={styles.macro}>F: {entry.fat}g</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F5F5F0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3D4F',
    marginBottom: 4,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calories: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A67356',
  },
  macros: {
    flexDirection: 'row',
    gap: 8,
  },
  macro: {
    fontSize: 14,
    color: '#829AAF',
  },
});

export default FoodEntryCard; 