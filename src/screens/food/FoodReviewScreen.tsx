import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FoodStackParamList } from '../../navigation/FoodStack';

type FoodReviewScreenNavigationProp = NativeStackNavigationProp<FoodStackParamList>;

const FoodReviewScreen = () => {
  const navigation = useNavigation<FoodReviewScreenNavigationProp>();
  const route = useRoute();
  const { prediction } = route.params as { prediction: any };

  const handleSave = async () => {
    try {
      // TODO: Save food entry
      navigation.navigate('FoodEntries');
    } catch (error) {
      console.error('Error saving food entry:', error);
      Alert.alert('Error', 'Failed to save food entry');
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
        <Text style={styles.title}>Review Food</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.predictionCard}>
          <Text style={styles.predictionTitle}>Detected Food</Text>
          <Text style={styles.predictionText}>{prediction?.name || 'Unknown'}</Text>
        </View>

        {/* TODO: Add nutrition information and editing capabilities */}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save Food Entry</Text>
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
  predictionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  predictionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  predictionText: {
    fontSize: 18,
    color: '#2C3E50',
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

export default FoodReviewScreen; 