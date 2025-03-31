import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FoodEntryItemProps {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  onDelete: () => void;
}

const FoodEntryItem: React.FC<FoodEntryItemProps> = ({
  name,
  calories,
  protein,
  carbs,
  fat,
  onDelete,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          <TouchableOpacity onPress={onDelete}>
            <Ionicons name="trash-outline" size={20} color="#E74C3C" />
          </TouchableOpacity>
        </View>
        <View style={styles.macros}>
          <Text style={styles.calories}>{calories} cal</Text>
          <Text style={styles.macro}>P: {protein}g</Text>
          <Text style={styles.macro}>C: {carbs}g</Text>
          <Text style={styles.macro}>F: {fat}g</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  macros: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  calories: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  macro: {
    fontSize: 14,
    color: '#7F8C8D',
  },
});

export default FoodEntryItem; 