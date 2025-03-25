import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { UserStats } from '../types';

const HistoryScreen = () => {
  const [selectedDate, setSelectedDate] = React.useState('');
  const [stats, setStats] = React.useState<UserStats>({
    weight: 0,
    goalWeight: 0,
    dailyCalorieGoal: 0,
    entries: {}
  });

  const markedDates = {
    // Example marked dates
    [selectedDate]: { selected: true, selectedColor: '#2196F3' },
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: '#2196F3',
          todayTextColor: '#2196F3',
          arrowColor: '#2196F3',
        }}
      />
      {selectedDate && (
        <View style={styles.statsContainer}>
          <Text style={styles.dateTitle}>{selectedDate}</Text>
          <Text style={styles.statText}>
            Calories: {stats.entries[selectedDate]?.reduce((acc, entry) => acc + entry.calories, 0) || 0}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statsContainer: {
    padding: 20,
  },
  dateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default HistoryScreen; 