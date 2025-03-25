import React from 'react';
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  // Mock data for demonstration
  const currentStreak = 5; // days
  const bestStreak = 12; // days
  const weeklyProgress = {
    calories: {
      current: 12500,
      goal: 14000,
    },
    protein: {
      current: 525,
      goal: 600,
    },
    carbs: {
      current: 875,
      goal: 1000,
    },
    fat: {
      current: 325,
      goal: 350,
    },
  };

  const markedDates = {
    [selectedDate]: { selected: true, selectedColor: '#1E4D6B' },
  };

  const getProgressColor = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage > 100) return '#A67356'; // Warm Cognac
    if (percentage > 90) return '#829AAF'; // Muted Steel Blue
    return '#739E82'; // Sage Green
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F0" />
      <View style={styles.container}>
        <View style={styles.streakContainer}>
          <View style={styles.streakCard}>
            <Text style={styles.streakLabel}>Current Streak</Text>
            <Text style={styles.streakValue}>{currentStreak} days</Text>
          </View>
          <View style={styles.streakCard}>
            <Text style={styles.streakLabel}>Best Streak</Text>
            <Text style={styles.streakValue}>{bestStreak} days</Text>
          </View>
        </View>

        <View style={styles.weeklyProgressContainer}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          <View style={styles.progressGrid}>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Calories</Text>
              <Text style={[styles.progressValue, { 
                color: getProgressColor(weeklyProgress.calories.current, weeklyProgress.calories.goal)
              }]}>
                {weeklyProgress.calories.current} / {weeklyProgress.calories.goal}
              </Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Protein</Text>
              <Text style={[styles.progressValue, { 
                color: getProgressColor(weeklyProgress.protein.current, weeklyProgress.protein.goal)
              }]}>
                {weeklyProgress.protein.current}g / {weeklyProgress.protein.goal}g
              </Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Carbs</Text>
              <Text style={[styles.progressValue, { 
                color: getProgressColor(weeklyProgress.carbs.current, weeklyProgress.carbs.goal)
              }]}>
                {weeklyProgress.carbs.current}g / {weeklyProgress.carbs.goal}g
              </Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Fat</Text>
              <Text style={[styles.progressValue, { 
                color: getProgressColor(weeklyProgress.fat.current, weeklyProgress.fat.goal)
              }]}>
                {weeklyProgress.fat.current}g / {weeklyProgress.fat.goal}g
              </Text>
            </View>
          </View>
        </View>

        <Calendar
          onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          theme={{
            backgroundColor: '#F5F5F0',
            calendarBackground: '#F5F5F0',
            selectedDayBackgroundColor: '#1E4D6B',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#1E4D6B',
            dayTextColor: '#2C3D4F',
            textDisabledColor: '#829AAF',
            dotColor: '#739E82',
            arrowColor: '#1E4D6B',
            monthTextColor: '#2C3D4F',
            textDayFontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
            textMonthFontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
            textDayHeaderFontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
            textDayFontWeight: '400',
            textMonthFontWeight: '700',
            textDayHeaderFontWeight: '600',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
        />
        {selectedDate && (
          <View style={styles.statsContainer}>
            <Text style={styles.dateTitle}>{selectedDate}</Text>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Calories</Text>
              <Text style={styles.statValue}>
                {stats.entries[selectedDate]?.reduce((acc, entry) => acc + entry.calories, 0) || 0}
              </Text>
            </View>
          </View>
        )}
      </View>
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
  streakContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  streakCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#2C3D4F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  streakLabel: {
    fontSize: 15,
    color: '#829AAF',
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '500',
  },
  streakValue: {
    fontSize: 24,
    color: '#1E4D6B',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '700',
  },
  weeklyProgressContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C3D4F',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    letterSpacing: -0.5,
  },
  progressGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  progressItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#2C3D4F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  progressLabel: {
    fontSize: 15,
    color: '#829AAF',
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '600',
  },
  statsContainer: {
    padding: 16,
  },
  dateTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C3D4F',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    letterSpacing: -0.5,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#2C3D4F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  statLabel: {
    fontSize: 15,
    color: '#829AAF',
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    color: '#1E4D6B',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '700',
  },
});

export default HistoryScreen; 