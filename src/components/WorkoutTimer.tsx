import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Platform, AppState } from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';

interface WorkoutTimerProps {
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({
  onPause,
  onResume,
  onStop,
}) => {
  useKeepAwake();
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [lastActiveTime, setLastActiveTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        if (lastActiveTime) {
          const timeDiff = Math.floor((Date.now() - lastActiveTime) / 1000);
          setTime((prevTime) => prevTime + timeDiff);
        }
        setLastActiveTime(null);
      } else if (nextAppState === 'background') {
        setLastActiveTime(Date.now());
      }
    });

    return () => {
      subscription.remove();
    };
  }, [lastActiveTime]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Text style={styles.timer}>{formatTime(time)}</Text>
  );
};

const styles = StyleSheet.create({
  timer: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C3D4F',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'monospace',
    letterSpacing: 1,
  },
});

export default WorkoutTimer; 