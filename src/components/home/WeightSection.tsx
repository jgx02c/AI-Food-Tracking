import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WeightSectionProps {
  currentWeight: string;
  targetWeight: string;
}

const WeightSection = ({ currentWeight, targetWeight }: WeightSectionProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="scale-outline" size={24} color="#1E4D6B" />
          <Text style={styles.title}>Today's Weight</Text>
        </View>
      </View>
      <View style={styles.weightContainer}>
        <View style={styles.weightCard}>
          <Text style={styles.weightValue}>{currentWeight || '--'}</Text>
          <Text style={styles.weightLabel}>Current Weight</Text>
        </View>
        <View style={styles.weightCard}>
          <Text style={styles.weightValue}>{targetWeight || '--'}</Text>
          <Text style={styles.weightLabel}>Target Weight</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 8,
  },
  weightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  weightCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  weightValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  weightLabel: {
    fontSize: 14,
    color: '#7F8C8D',
  },
});

export default WeightSection; 