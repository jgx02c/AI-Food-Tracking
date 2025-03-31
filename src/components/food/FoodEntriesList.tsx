import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import FoodEntryItem from './FoodEntryItem';
import { FoodEntry } from '../../services/storage';

interface FoodEntriesListProps {
  entries: FoodEntry[];
  onDeleteEntry: (id: string) => void;
}

const FoodEntriesList: React.FC<FoodEntriesListProps> = ({
  entries,
  onDeleteEntry,
}) => {
  if (entries.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No food entries yet</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {entries.map((entry) => (
        <FoodEntryItem
          key={entry.id}
          name={entry.name}
          calories={entry.calories}
          protein={entry.protein}
          carbs={entry.carbs}
          fat={entry.fat}
          onDelete={() => onDeleteEntry(entry.id)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
  },
});

export default FoodEntriesList; 