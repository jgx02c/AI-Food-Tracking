import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FoodEntriesService } from '../../services/foodEntries';
import TimePickerModal from '../../components/food/TimePickerModal';
import FoodEntryForm from '../../components/food/FoodEntryForm';

const ManualFoodEntryScreen = () => {
  const navigation = useNavigation();
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [servingUnit, setServingUnit] = useState<'g' | 'ml' | 'oz'>('g');
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSave = async () => {
    if (!foodName || !calories || !servingSize) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const entry = {
        name: foodName,
        calories: parseInt(calories),
        protein: parseInt(protein) || 0,
        carbs: parseInt(carbs) || 0,
        fat: parseInt(fat) || 0,
        date: selectedTime.toISOString(),
        servingSize: `${servingSize}${servingUnit}`,
      };

      await FoodEntriesService.addFoodEntry(entry);
      Alert.alert('Success', 'Food entry saved successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving food entry:', error);
      Alert.alert('Error', 'Failed to save food entry');
    }
  };

  const onTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedDate) {
      setSelectedTime(selectedDate);
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
        <Text style={styles.title}>Manual Food Entry</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <FoodEntryForm
          foodName={foodName}
          calories={calories}
          protein={protein}
          carbs={carbs}
          fat={fat}
          servingSize={servingSize}
          servingUnit={servingUnit}
          selectedTime={selectedTime}
          onFoodNameChange={setFoodName}
          onCaloriesChange={setCalories}
          onProteinChange={setProtein}
          onCarbsChange={setCarbs}
          onFatChange={setFat}
          onServingSizeChange={setServingSize}
          onServingUnitChange={setServingUnit}
          onTimePress={() => setShowTimePicker(true)}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save Entry</Text>
        </TouchableOpacity>

        <TimePickerModal
          visible={showTimePicker}
          selectedTime={selectedTime}
          onClose={() => setShowTimePicker(false)}
          onTimeChange={onTimeChange}
        />
      </ScrollView>
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
  contentContainer: {
    paddingBottom: 32,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C3E50',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ManualFoodEntryScreen; 