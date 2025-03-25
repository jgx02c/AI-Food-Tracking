import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  AppState,
} from 'react-native';
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

  const handlePauseResume = () => {
    setIsRunning(!isRunning);
    if (isRunning) {
      onPause?.();
    } else {
      onResume?.();
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    setTime(0);
    onStop?.();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(time)}</Text>
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, styles.pauseButton]}
          onPress={handlePauseResume}
        >
          <Text style={styles.buttonText}>
            {isRunning ? 'Pause' : 'Resume'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.stopButton]}
          onPress={handleStop}
        >
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#2C3D4F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  timer: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C3D4F',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'monospace',
    letterSpacing: 1,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: '#1E4D6B',
  },
  stopButton: {
    backgroundColor: '#A67356',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});

export default WorkoutTimer; 