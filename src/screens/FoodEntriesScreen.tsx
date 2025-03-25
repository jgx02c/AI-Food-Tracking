import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FoodEntry } from '../types';
import { FoodEntriesService } from '../services/foodEntries';
import { Ionicons } from '@expo/vector-icons';

const FoodEntriesScreen = () => {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEntries = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const allEntries = await FoodEntriesService.getFoodEntries();
      const todayEntries = allEntries.filter(entry => entry.date === today);
      setEntries(todayEntries);
    } catch (error) {
      console.error('Error fetching entries:', error);
      Alert.alert('Error', 'Failed to fetch food entries');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEntries();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const renderEntry = ({ item }: { item: FoodEntry }) => (
    <View style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <Text style={styles.entryName}>{item.name}</Text>
        <Text style={styles.entryCalories}>{item.calories} cal</Text>
      </View>
      <View style={styles.macrosContainer}>
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Protein</Text>
          <Text style={styles.macroValue}>{item.protein}g</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Carbs</Text>
          <Text style={styles.macroValue}>{item.carbs}g</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Fat</Text>
          <Text style={styles.macroValue}>{item.fat}g</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Food Entries</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
      </View>
      <FlatList
        data={entries}
        renderItem={renderEntry}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={48} color="#7F8C8D" />
            <Text style={styles.emptyText}>No food entries for today</Text>
          </View>
        }
      />
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  listContainer: {
    padding: 16,
  },
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  entryCalories: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A67356',
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 16,
  },
});

export default FoodEntriesScreen; 