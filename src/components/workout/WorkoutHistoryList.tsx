import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ActiveWorkout } from '../../types/workout';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';

interface WorkoutHistoryListProps {
  groupedWorkouts: {
    today: ActiveWorkout[];
    yesterday: ActiveWorkout[];
    pastWeek: ActiveWorkout[];
    older: ActiveWorkout[];
  };
  onLoadMore: () => void;
  hasMore: boolean;
}

const formatDuration = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const WorkoutHistoryList: React.FC<WorkoutHistoryListProps> = ({
  groupedWorkouts,
  onLoadMore,
  hasMore,
}) => {
  const navigation = useNavigation();

  const handleWorkoutPress = (workout: ActiveWorkout) => {
    navigation.navigate('WorkoutDetails', { workoutId: workout.id });
  };

  const renderWorkoutGroup = (title: string, workouts: ActiveWorkout[]) => {
    if (workouts.length === 0) return null;

    return (
      <View style={styles.groupContainer}>
        <View style={styles.groupHeader}>
          <Text style={styles.groupTitle}>{title}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.workoutList}>
          {workouts.map((workout) => (
            <TouchableOpacity
              key={workout.id}
              style={styles.workoutCard}
              onPress={() => handleWorkoutPress(workout)}
            >
              <View style={styles.workoutHeader}>
                <Text style={styles.workoutName}>{workout.template?.name || 'Unknown Workout'}</Text>
                <Text style={styles.workoutTime}>
                  {format(new Date(workout.startTime), 'h:mm a')}
                </Text>
              </View>
              <View style={styles.workoutStats}>
                <Text style={styles.workoutStat}>
                  {workout.exercises.length} exercises
                </Text>
                <Text style={styles.workoutDuration}>
                  {workout.endTime ? formatDuration(Math.floor((new Date(workout.endTime).getTime() - new Date(workout.startTime).getTime()) / 1000)) : 'In Progress'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      onScroll={({ nativeEvent }) => {
        const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
        const paddingToBottom = 20;
        const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
        
        if (isCloseToBottom && hasMore) {
          onLoadMore();
        }
      }}
      scrollEventThrottle={400}
    >
      {renderWorkoutGroup('Today', groupedWorkouts.today)}
      {renderWorkoutGroup('Yesterday', groupedWorkouts.yesterday)}
      {renderWorkoutGroup('Past Week', groupedWorkouts.pastWeek)}
      {renderWorkoutGroup('Older', groupedWorkouts.older)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  groupContainer: {
    marginBottom: 24,
  },
  groupHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  groupTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  workoutList: {
    paddingHorizontal: 16,
  },
  workoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    flex: 1,
  },
  workoutTime: {
    fontSize: 14,
    color: '#7F8C8D',
    marginLeft: 8,
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutStat: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  workoutDuration: {
    fontSize: 14,
    color: '#7F8C8D',
  },
});

export default WorkoutHistoryList; 