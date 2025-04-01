import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { GoalListProps } from '../../types/goals';
import GoalCard from './GoalCard';

const GoalList = ({ goals, onGoalPress }: GoalListProps) => {
  return (
    <FlatList
      data={goals}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <GoalCard
          goal={item}
          onPress={onGoalPress}
        />
      )}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default GoalList; 