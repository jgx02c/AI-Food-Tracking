import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WorkoutHeaderProps {
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  isPaused: boolean;
  elapsedTime: number;
}

const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({
  onPause,
  onResume,
  onStop,
  isPaused,
  elapsedTime,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onStop} style={styles.stopButton}>
        <Ionicons name="close" size={24} color="#2C3E50" />
      </TouchableOpacity>
      
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
      </View>

      <TouchableOpacity
        onPress={isPaused ? onResume : onPause}
        style={styles.pauseButton}
      >
        <Ionicons
          name={isPaused ? "play" : "pause"}
          size={24}
          color="#2C3E50"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  stopButton: {
    padding: 8,
  },
  timerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
  },
  pauseButton: {
    padding: 8,
  },
});

export default WorkoutHeader; 