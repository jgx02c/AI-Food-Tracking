import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Platform, ActionSheetIOS } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FoodEntry } from '../services/storage';
import { FoodEntriesService } from '../services/foodEntries';
import { useNavigation } from '@react-navigation/native';
import { format, isToday, isYesterday, isThisWeek, subWeeks, isWithinInterval } from 'date-fns';

type GroupedEntries = {
  today: FoodEntry[];
  yesterday: FoodEntry[];
  thisWeek: FoodEntry[];
  lastWeek: FoodEntry[];
  older: FoodEntry[];
};

const FoodEntriesScreen = () => {
  const navigation = useNavigation();
  const [groupedEntries, setGroupedEntries] = useState<GroupedEntries>({
    today: [],
    yesterday: [],
    thisWeek: [],
    lastWeek: [],
    older: [],
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadEntries = async () => {
    try {
      const allEntries = await FoodEntriesService.getFoodEntries();
      
      // Sort entries by date (newest first)
      const sortedEntries = allEntries.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      // Group entries by time period
      const grouped: GroupedEntries = {
        today: [],
        yesterday: [],
        thisWeek: [],
        lastWeek: [],
        older: [],
      };

      const now = new Date();
      const lastWeekStart = subWeeks(now, 1);
      const lastWeekEnd = subWeeks(now, 0);

      sortedEntries.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (isToday(entryDate)) {
          grouped.today.push(entry);
        } else if (isYesterday(entryDate)) {
          grouped.yesterday.push(entry);
        } else if (isThisWeek(entryDate)) {
          grouped.thisWeek.push(entry);
        } else if (isWithinInterval(entryDate, { start: lastWeekStart, end: lastWeekEnd })) {
          grouped.lastWeek.push(entry);
        } else {
          grouped.older.push(entry);
        }
      });

      setGroupedEntries(grouped);
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
            {format(new Date(entry.date), 'h:mm a')}
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

  const renderSection = (title: string, entries: FoodEntry[]) => {
    if (entries.length === 0) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {entries.map(renderEntry)}
      </View>
    );
  };

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
        {groupedEntries.today.length === 0 && 
         groupedEntries.yesterday.length === 0 && 
         groupedEntries.thisWeek.length === 0 && 
         groupedEntries.lastWeek.length === 0 && 
         groupedEntries.older.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={48} color="#D9D9D9" />
            <Text style={styles.emptyStateText}>No food entries yet</Text>
          </View>
        ) : (
          <>
            {renderSection('Today', groupedEntries.today)}
            {renderSection('Yesterday', groupedEntries.yesterday)}
            {renderSection('This Week', groupedEntries.thisWeek)}
            {renderSection('Last Week', groupedEntries.lastWeek)}
            {renderSection('Older', groupedEntries.older)}
          </>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7F8C8D',
    marginBottom: 12,
    paddingLeft: 4,
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