import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { StreakCardProps } from '../../types/components';

const StreakCard = ({ label, value }: StreakCardProps) => {
  return (
    <View style={styles.streakCard}>
      <Text style={styles.streakLabel}>{label}</Text>
      <Text style={styles.streakValue}>{value} days</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  streakCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#2C3D4F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  streakLabel: {
    fontSize: 14,
    color: '#829AAF',
    marginBottom: 4,
  },
  streakValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E4D6B',
  },
});

export default StreakCard; 