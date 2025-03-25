import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserGoals {
  calorieGoal: string;
  proteinGoal: string;
  carbsGoal: string;
  fatGoal: string;
  weight: string;
  targetWeight: string;
}

const STORAGE_KEY = '@user_goals';

const SettingsScreen = () => {
  const [goals, setGoals] = useState<UserGoals>({
    calorieGoal: '2000',
    proteinGoal: '150',
    carbsGoal: '200',
    fatGoal: '65',
    weight: '',
    targetWeight: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const savedGoals = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      }
    } catch (error) {
      console.error('Error loading goals:', error);
      Alert.alert('Error', 'Failed to load your goals');
    }
  };

  const saveGoals = async () => {
    try {
      setIsSaving(true);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
      Alert.alert('Success', 'Your goals have been saved');
    } catch (error) {
      console.error('Error saving goals:', error);
      Alert.alert('Error', 'Failed to save your goals');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (key: keyof UserGoals, value: string) => {
    // Only allow numbers
    if (value && !/^\d*\.?\d*$/.test(value)) return;
    setGoals(prev => ({ ...prev, [key]: value }));
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Nutrition Goals</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Daily Calories</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={goals.calorieGoal}
              onChangeText={(value) => handleChange('calorieGoal', value)}
              placeholder="Enter daily calorie goal"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Protein (g)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={goals.proteinGoal}
              onChangeText={(value) => handleChange('proteinGoal', value)}
              placeholder="Enter protein goal"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Carbs (g)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={goals.carbsGoal}
              onChangeText={(value) => handleChange('carbsGoal', value)}
              placeholder="Enter carbs goal"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fat (g)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={goals.fatGoal}
              onChangeText={(value) => handleChange('fatGoal', value)}
              placeholder="Enter fat goal"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weight Tracking</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Weight (kg)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={goals.weight}
              onChangeText={(value) => handleChange('weight', value)}
              placeholder="Enter current weight"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Target Weight (kg)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={goals.targetWeight}
              onChangeText={(value) => handleChange('targetWeight', value)}
              placeholder="Enter target weight"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={saveGoals}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save Goals'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SettingsScreen; 