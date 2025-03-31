import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Platform, ActionSheetIOS } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FoodEntry } from '../services/storage';
import { FoodEntriesService } from '../services/foodEntries';
import { useNavigation } from '@react-navigation/native';

const FoodEntriesScreen = () => {
  const navigation = useNavigation();
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadEntries = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const allEntries = await FoodEntriesService.getFoodEntries();
      const todayEntries = allEntries.filter(entry => entry.date === today);
      setEntries(todayEntries);
    } catch (error) {
      console.error('Error loading food entries:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEntries();
    setRefreshing(false);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const showAddOptions = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Add with Camera', 'Add Manually'],
        cancelButtonIndex: 0,
      },
      (buttonIndex: number) => {
        if (buttonIndex === 1) {
          navigation.navigate('Camera');
        } else if (buttonIndex === 2) {
          navigation.navigate('ManualFoodEntry');
        }
      }
    );
  };

  const renderEntry = (entry: FoodEntry) => (
    <View key={entry.id} style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <View style={styles.entryIcon}>
          <Ionicons name="restaurant-outline" size={24} color="#1E4D6B" />
        </View>
        <View style={styles.entryInfo}>
          <Text style={styles.entryTitle}>{entry.name}</Text>
          <Text style={styles.entryTime}>
            {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
      <View style={styles.entryDetails}>
        <Text style={styles.detailText}>Calories: {entry.calories}</Text>
        <Text style={styles.detailText}>Protein: {entry.protein}g</Text>
        <Text style={styles.detailText}>Carbs: {entry.carbs}g</Text>
        <Text style={styles.detailText}>Fat: {entry.fat}g</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Food Entries</Text>
        <TouchableOpacity onPress={showAddOptions} style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={24} color="#1E4D6B" />
        </TouchableOpacity>
      </View>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {entries.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={48} color="#D9D9D9" />
            <Text style={styles.emptyStateText}>No food entries today</Text>
          </View>
        ) : (
          entries.map(renderEntry)
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  addButton: {
    padding: 8,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  entryCard: {
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
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  entryInfo: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  entryTime: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 2,
  },
  entryDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#2C3E50',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 8,
  },
});

export default FoodEntriesScreen; 