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
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService } from '../../services/storage';

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
  const [piclistKey, setPiclistKey] = useState('');

  useEffect(() => {
    loadGoals();
    loadSettings();
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

  const loadSettings = async () => {
    const key = await StorageService.getPiclistKey();
    if (key) {
      setPiclistKey(key);
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

  const handleSaveSettings = async () => {
    await StorageService.savePiclistKey(piclistKey);
    Alert.alert('Success', 'Settings saved successfully');
  };

  const handleChange = (key: keyof UserGoals, value: string) => {
    // Only allow numbers
    if (value && !/^\d*\.?\d*$/.test(value)) return;
    setGoals(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F0" />
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
                placeholderTextColor="#829AAF"
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
                placeholderTextColor="#829AAF"
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
                placeholderTextColor="#829AAF"
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
                placeholderTextColor="#829AAF"
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
                placeholderTextColor="#829AAF"
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
                placeholderTextColor="#829AAF"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>API Settings</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Piclist API Key</Text>
              <TextInput
                style={styles.input}
                value={piclistKey}
                onChangeText={setPiclistKey}
                placeholder="Enter your Piclist API key"
                placeholderTextColor="#829AAF"
                secureTextEntry
              />
              <Text style={styles.helperText}>
                Get your API key from Piclist Handoff
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={() => {
              saveGoals();
              handleSaveSettings();
            }}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save Goals'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#2C3D4F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#2C3D4F',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    letterSpacing: -0.5,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    marginBottom: 8,
    color: '#829AAF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F5F5F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    color: '#2C3D4F',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  inputContainer: {
    marginBottom: 16,
  },
  helperText: {
    fontSize: 12,
    color: '#829AAF',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  saveButton: {
    backgroundColor: '#1E4D6B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 24,
    elevation: 1,
    shadowColor: '#2C3D4F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#829AAF',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});

export default SettingsScreen; 