import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ManualFoodEntryScreen = () => {
  const navigation = useNavigation();
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [servingUnit, setServingUnit] = useState('g');

  const handleSave = () => {
    if (!foodName || !calories || !servingSize) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // TODO: Save food entry to storage
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Manual Food Entry</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Food Name *</Text>
            <TextInput
              style={styles.input}
              value={foodName}
              onChangeText={setFoodName}
              placeholder="Enter food name"
              placeholderTextColor="#7F8C8D"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Calories *</Text>
            <TextInput
              style={styles.input}
              value={calories}
              onChangeText={setCalories}
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
                onChangeText={setProtein}
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
                onChangeText={setCarbs}
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
                onChangeText={setFat}
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
                onChangeText={setServingSize}
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
                  onPress={() => setServingUnit('g')}
                >
                  <Text style={[styles.unitButtonText, servingUnit === 'g' && styles.unitButtonTextActive]}>g</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.unitButton, servingUnit === 'ml' && styles.unitButtonActive]}
                  onPress={() => setServingUnit('ml')}
                >
                  <Text style={[styles.unitButtonText, servingUnit === 'ml' && styles.unitButtonTextActive]}>ml</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.unitButton, servingUnit === 'oz' && styles.unitButtonActive]}
                  onPress={() => setServingUnit('oz')}
                >
                  <Text style={[styles.unitButtonText, servingUnit === 'oz' && styles.unitButtonTextActive]}>oz</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save Entry</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2C3E50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  macrosContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  macroInput: {
    flex: 1,
    gap: 8,
  },
  servingContainer: {
    gap: 16,
  },
  servingInput: {
    gap: 8,
  },
  unitSelector: {
    gap: 8,
  },
  unitButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  unitButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unitButtonActive: {
    backgroundColor: '#1E4D6B',
  },
  unitButtonText: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  unitButtonTextActive: {
    color: '#FFFFFF',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2ECC71',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ManualFoodEntryScreen; 