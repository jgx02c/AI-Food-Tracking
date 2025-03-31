import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FoodEntryFormProps {
  foodName: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  servingSize: string;
  servingUnit: 'g' | 'ml' | 'oz';
  selectedTime: Date;
  onFoodNameChange: (text: string) => void;
  onCaloriesChange: (text: string) => void;
  onProteinChange: (text: string) => void;
  onCarbsChange: (text: string) => void;
  onFatChange: (text: string) => void;
  onServingSizeChange: (text: string) => void;
  onServingUnitChange: (unit: 'g' | 'ml' | 'oz') => void;
  onTimePress: () => void;
}

const FoodEntryForm: React.FC<FoodEntryFormProps> = ({
  foodName,
  calories,
  protein,
  carbs,
  fat,
  servingSize,
  servingUnit,
  selectedTime,
  onFoodNameChange,
  onCaloriesChange,
  onProteinChange,
  onCarbsChange,
  onFatChange,
  onServingSizeChange,
  onServingUnitChange,
  onTimePress,
}) => {
  return (
    <View style={styles.form}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Food Name *</Text>
        <TextInput
          style={styles.input}
          value={foodName}
          onChangeText={onFoodNameChange}
          placeholder="Enter food name"
          placeholderTextColor="#7F8C8D"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Time</Text>
        <TouchableOpacity 
          style={styles.timeButton}
          onPress={onTimePress}
        >
          <Text style={styles.timeButtonText}>
            {selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Calories *</Text>
        <TextInput
          style={styles.input}
          value={calories}
          onChangeText={onCaloriesChange}
          placeholder="Enter calories"
          placeholderTextColor="#7F8C8D"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.macrosContainer}>
        <View style={styles.macroInput}>
          <Text style={styles.label}>Protein</Text>
          <TextInput
            style={styles.input}
            value={protein}
            onChangeText={onProteinChange}
            placeholder="Protein (g)"
            placeholderTextColor="#7F8C8D"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.macroInput}>
          <Text style={styles.label}>Carbs</Text>
          <TextInput
            style={styles.input}
            value={carbs}
            onChangeText={onCarbsChange}
            placeholder="Carbs (g)"
            placeholderTextColor="#7F8C8D"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.macroInput}>
          <Text style={styles.label}>Fat</Text>
          <TextInput
            style={styles.input}
            value={fat}
            onChangeText={onFatChange}
            placeholder="Fat (g)"
            placeholderTextColor="#7F8C8D"
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.servingContainer}>
        <View style={styles.servingInput}>
          <Text style={styles.label}>Serving Size *</Text>
          <TextInput
            style={styles.input}
            value={servingSize}
            onChangeText={onServingSizeChange}
            placeholder="Enter serving size"
            placeholderTextColor="#7F8C8D"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.unitSelector}>
          <Text style={styles.label}>Unit</Text>
          <View style={styles.unitButtons}>
            <TouchableOpacity 
              style={[styles.unitButton, servingUnit === 'g' && styles.unitButtonActive]}
              onPress={() => onServingUnitChange('g')}
            >
              <Text style={[styles.unitButtonText, servingUnit === 'g' && styles.unitButtonTextActive]}>g</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.unitButton, servingUnit === 'ml' && styles.unitButtonActive]}
              onPress={() => onServingUnitChange('ml')}
            >
              <Text style={[styles.unitButtonText, servingUnit === 'ml' && styles.unitButtonTextActive]}>ml</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.unitButton, servingUnit === 'oz' && styles.unitButtonActive]}
              onPress={() => onServingUnitChange('oz')}
            >
              <Text style={[styles.unitButtonText, servingUnit === 'oz' && styles.unitButtonTextActive]}>oz</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  timeButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  timeButtonText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  macrosContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  macroInput: {
    flex: 1,
  },
  servingContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  servingInput: {
    flex: 2,
  },
  unitSelector: {
    flex: 1,
  },
  unitButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F0',
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: '#2C3E50',
  },
  unitButtonText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  unitButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default FoodEntryForm; 