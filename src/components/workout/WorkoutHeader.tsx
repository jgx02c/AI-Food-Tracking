import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WorkoutTimer from '../WorkoutTimer';

interface WorkoutHeaderProps {
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  isPaused: boolean;
}

const WorkoutHeader = ({ onPause, onResume, onStop, isPaused }: WorkoutHeaderProps) => {
  return (
    <View style={styles.workoutHeader}>
      <WorkoutTimer
        onPause={onPause}
        onResume={onResume}
        onStop={onStop}
      />
      <View style={styles.timerControls}>
        <TouchableOpacity
          style={styles.timerControlButton}
          onPress={() => isPaused ? onResume() : onPause()}
        >
          <Ionicons
            name={isPaused ? 'play' : 'pause'}
            size={24}
            color="#1E4D6B"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.timerControlButton}
          onPress={onStop}
        >
          <Ionicons name="stop" size={24} color="#A67356" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F0',
  },
  timerControls: {
    flexDirection: 'row',
    gap: 16,
  },
  timerControlButton: {
    padding: 8,
  },
});

export default WorkoutHeader; 