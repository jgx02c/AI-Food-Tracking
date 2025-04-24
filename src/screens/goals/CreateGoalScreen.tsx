import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import GoalsService, { Goal } from '../services/goals';

const CreateGoalScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'food' | 'workout' | 'weight'>('food');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [category, setCategory] = useState<'maintenance' | 'improvement'>('maintenance');
  const [duration, setDuration] = useState('30'); // Default 30 days
  const [isActive, setIsActive] = useState(true);

  const handleCreate = async () => {
    if (!title || !target || !unit) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const goal: Goal = {
        id: Date.now().toString(),
        title,
        type,
        target: parseFloat(target),
        current: 0,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + parseInt(duration) * 24 * 60 * 60 * 1000).toISOString(),
        unit,
        frequency,
        category,
        isActive,
      };

      await GoalsService.saveGoal(goal);
      navigation.goBack();
    } catch (error) {
      console.error('Error creating goal:', error);
      Alert.alert('Error', 'Failed to create goal');
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
        <Text style={styles.title}>Create New Goal</Text>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Goal Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter goal title"
              placeholderTextColor="#7F8C8D"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.typeButtons}>
              <TouchableOpacity 
                style={[styles.typeButton, type === 'food' && styles.typeButtonActive]}
                onPress={() => setType('food')}
              >
                <Ionicons name="restaurant-outline" size={24} color={type === 'food' ? '#FFFFFF' : '#2C3E50'} />
                <Text style={[styles.typeButtonText, type === 'food' && styles.typeButtonTextActive]}>Food</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.typeButton, type === 'workout' && styles.typeButtonActive]}
                onPress={() => setType('workout')}
              >
                <Ionicons name="fitness-outline" size={24} color={type === 'workout' ? '#FFFFFF' : '#2C3E50'} />
                <Text style={[styles.typeButtonText, type === 'workout' && styles.typeButtonTextActive]}>Workout</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.typeButton, type === 'weight' && styles.typeButtonActive]}
                onPress={() => setType('weight')}
              >
                <Ionicons name="scale-outline" size={24} color={type === 'weight' ? '#FFFFFF' : '#2C3E50'} />
                <Text style={[styles.typeButtonText, type === 'weight' && styles.typeButtonTextActive]}>Weight</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Target</Text>
            <TextInput
              style={styles.input}
              value={target}
              onChangeText={setTarget}
              placeholder="Enter target value"
              placeholderTextColor="#7F8C8D"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Unit</Text>
            <TextInput
              style={styles.input}
              value={unit}
              onChangeText={setUnit}
              placeholder="Enter unit (e.g., calories, kg, reps)"
              placeholderTextColor="#7F8C8D"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Frequency</Text>
            <View style={styles.frequencyButtons}>
              <TouchableOpacity 
                style={[styles.frequencyButton, frequency === 'daily' && styles.frequencyButtonActive]}
                onPress={() => setFrequency('daily')}
              >
                <Text style={[styles.frequencyButtonText, frequency === 'daily' && styles.frequencyButtonTextActive]}>Daily</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.frequencyButton, frequency === 'weekly' && styles.frequencyButtonActive]}
                onPress={() => setFrequency('weekly')}
              >
                <Text style={[styles.frequencyButtonText, frequency === 'weekly' && styles.frequencyButtonTextActive]}>Weekly</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.frequencyButton, frequency === 'monthly' && styles.frequencyButtonActive]}
                onPress={() => setFrequency('monthly')}
              >
                <Text style={[styles.frequencyButtonText, frequency === 'monthly' && styles.frequencyButtonTextActive]}>Monthly</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryButtons}>
              <TouchableOpacity 
                style={[styles.categoryButton, category === 'maintenance' && styles.categoryButtonActive]}
                onPress={() => setCategory('maintenance')}
              >
                <Text style={[styles.categoryButtonText, category === 'maintenance' && styles.categoryButtonTextActive]}>Maintenance</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.categoryButton, category === 'improvement' && styles.categoryButtonActive]}
                onPress={() => setCategory('improvement')}
              >
                <Text style={[styles.categoryButtonText, category === 'improvement' && styles.categoryButtonTextActive]}>Improvement</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Duration (days)</Text>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              placeholder="Enter duration in days"
              placeholderTextColor="#7F8C8D"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Active Goal</Text>
            <TouchableOpacity 
              style={[styles.toggleButton, isActive && styles.toggleButtonActive]}
              onPress={() => setIsActive(!isActive)}
            >
              <Text style={[styles.toggleButtonText, isActive && styles.toggleButtonTextActive]}>
                {isActive ? 'Active' : 'Inactive'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Create Goal</Text>
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
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typeButtonActive: {
    backgroundColor: '#1E4D6B',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  frequencyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyButton: {
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
  frequencyButtonActive: {
    backgroundColor: '#1E4D6B',
  },
  frequencyButtonText: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  frequencyButtonTextActive: {
    color: '#FFFFFF',
  },
  categoryButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryButton: {
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
  categoryButtonActive: {
    backgroundColor: '#1E4D6B',
  },
  categoryButtonText: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  createButton: {
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
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  toggleButton: {
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
  toggleButtonActive: {
    backgroundColor: '#2ECC71',
  },
  toggleButtonText: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  toggleButtonTextActive: {
    color: '#FFFFFF',
  },
});

export default CreateGoalScreen; 