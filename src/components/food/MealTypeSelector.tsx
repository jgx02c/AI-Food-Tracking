import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

interface MealTypeSelectorProps {
  selectedMeal: MealType;
  onMealSelect: (meal: MealType) => void;
}

const MealTypeSelector: React.FC<MealTypeSelectorProps> = ({
  selectedMeal,
  onMealSelect,
}) => {
  const mealTypes: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {mealTypes.map((meal) => (
        <TouchableOpacity
          key={meal}
          style={[
            styles.mealButton,
            selectedMeal === meal && styles.mealButtonActive,
          ]}
          onPress={() => onMealSelect(meal)}
        >
          <Text
            style={[
              styles.mealButtonText,
              selectedMeal === meal && styles.mealButtonTextActive,
            ]}
          >
            {meal}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 8,
  },
  mealButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F5F0',
  },
  mealButtonActive: {
    backgroundColor: '#2C3E50',
  },
  mealButtonText: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  mealButtonTextActive: {
    color: '#FFFFFF',
  },
});

export default MealTypeSelector; 