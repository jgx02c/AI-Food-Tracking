import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FoodEntry } from '../../types';

interface FoodEntriesSectionProps {
  entries: FoodEntry[];
  onPress: () => void;
}

const FoodEntriesSection = ({ entries, onPress }: FoodEntriesSectionProps) => {
  return (
    <TouchableOpacity 
      style={styles.content}
      onPress={onPress}
    >
      {entries.length === 0 ? (
        <Text style={styles.emptyText}>No entries for today</Text>
      ) : (
        <>
          {entries.slice(0, 3).map(entry => (
            <View key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View style={styles.entryTitleContainer}>
                  <Ionicons name="restaurant-outline" size={20} color="#2C3E50" />
                  <Text style={styles.entryName}>{entry.name}</Text>
                </View>
              </View>
              <View style={styles.spacer} />
              <View style={styles.entryDetails}>
                <Text style={styles.entryCalories}>{entry.calories} cal</Text>
                <Text style={styles.entryMacros}>
                  P: {entry.protein}g | C: {entry.carbs}g | F: {entry.fat}g
                </Text>
              </View>
            </View>
          ))}
          {entries.length > 3 && (
            <Text style={styles.viewMoreText}>
              View {entries.length - 3} more entries
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 0,
  },
  emptyText: {
    textAlign: 'center',
    color: '#7F8C8D',
    fontSize: 14,
  },
  entryCard: {
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
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 8,
  },
  spacer: {
    height: 6,
    backgroundColor: '#F8F9FA',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  entryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryCalories: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  entryMacros: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  viewMoreText: {
    textAlign: 'center',
    color: '#1E4D6B',
    fontSize: 12,
    marginTop: 8,
  },
});

export default FoodEntriesSection; 