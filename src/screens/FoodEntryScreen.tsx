import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FoodEntry } from '../services/storage';
import { FoodEntriesService } from '../services/foodEntries';
import MealTypeSelector from '../components/food/MealTypeSelector';
import FoodEntriesList from '../components/food/FoodEntriesList';

const FoodEntryScreen = () => {
  const navigation = useNavigation();
  const [selectedMeal, setSelectedMeal] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'>('Breakfast');
  const [entries, setEntries] = useState<FoodEntry[]>([]);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const allEntries = await FoodEntriesService.getFoodEntries();
      // Filter entries by selected meal type
      const filteredEntries = allEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        const entryHour = entryDate.getHours();
        
        switch (selectedMeal) {
          case 'Breakfast':
            return entryHour >= 5 && entryHour < 11;
          case 'Lunch':
            return entryHour >= 11 && entryHour < 16;
          case 'Dinner':
            return entryHour >= 16 && entryHour < 22;
          case 'Snacks':
            return entryHour < 5 || entryHour >= 22;
          default:
            return false;
        }
      });
      
      setEntries(filteredEntries);
    } catch (error) {
      console.error('Error loading food entries:', error);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await FoodEntriesService.deleteFoodEntry(id);
      await loadEntries();
    } catch (error) {
      console.error('Error deleting food entry:', error);
      Alert.alert('Error', 'Failed to delete food entry');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#2C3E50" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Food Entries</Text>
      </View>

      <View style={styles.container}>
        <MealTypeSelector
          selectedMeal={selectedMeal}
          onMealSelect={setSelectedMeal}
        />

        <FoodEntriesList
          entries={entries}
          onDeleteEntry={handleDeleteEntry}
        />

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('ManualFoodEntry')}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Food</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  header: {
    padding: 16,
    backgroundColor: '#F5F5F0',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButtonText: {
    marginLeft: 4,
    color: '#2C3E50',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  container: {
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C3E50',
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default FoodEntryScreen; 