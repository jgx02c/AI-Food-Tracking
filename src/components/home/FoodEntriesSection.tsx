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
      style={styles.container}
      onPress={onPress}
    >
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Today's Food Entries</Text>
        <Ionicons name="chevron-forward" size={20} color="#7F8C8D" />
      </View>
      {entries.length === 0 ? (
        <Text style={styles.emptyText}>No entries for today</Text>
      ) : (
        <>
          {entries.slice(0, 3).map(entry => (
            <View key={entry.id} style={styles.entryCard}>
              <Text style={styles.entryName}>{entry.name}</Text>
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
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  emptyText: {
    textAlign: 'center',
    color: '#7F8C8D',
    fontSize: 16,
  },
  entryCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  entryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  entryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryCalories: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  entryMacros: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  viewMoreText: {
    textAlign: 'center',
    color: '#7F8C8D',
    fontSize: 14,
    marginTop: 8,
  },
});

export default FoodEntriesSection; 