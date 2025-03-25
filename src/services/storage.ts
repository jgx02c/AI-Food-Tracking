import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutTemplate, ActiveWorkout } from '../types/workout';

const STORAGE_KEYS = {
  WORKOUT_TEMPLATES: 'workout_templates',
  ACTIVE_WORKOUT: 'active_workout',
  PICLIST_KEY: 'piclist_key',
  FOOD_HISTORY: 'food_history',
};

export const StorageService = {
  // Workout Templates
  async getWorkoutTemplates(): Promise<WorkoutTemplate[]> {
    try {
      const templates = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_TEMPLATES);
      return templates ? JSON.parse(templates) : [];
    } catch (error) {
      console.error('Error getting workout templates:', error);
      return [];
    }
  },

  async saveWorkoutTemplates(templates: WorkoutTemplate[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WORKOUT_TEMPLATES, JSON.stringify(templates));
    } catch (error) {
      console.error('Error saving workout templates:', error);
    }
  },

  // Active Workout
  async getActiveWorkout(): Promise<ActiveWorkout | null> {
    try {
      const workout = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT);
      return workout ? JSON.parse(workout) : null;
    } catch (error) {
      console.error('Error getting active workout:', error);
      return null;
    }
  },

  async saveActiveWorkout(workout: ActiveWorkout | null): Promise<void> {
    try {
      if (workout) {
        await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(workout));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
      }
    } catch (error) {
      console.error('Error saving active workout:', error);
    }
  },

  // Piclist API Key
  async getPiclistKey(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.PICLIST_KEY);
    } catch (error) {
      console.error('Error getting Piclist key:', error);
      return null;
    }
  },

  async savePiclistKey(key: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PICLIST_KEY, key);
    } catch (error) {
      console.error('Error saving Piclist key:', error);
    }
  },

  // Food History
  async getFoodHistory(): Promise<any[]> {
    try {
      const history = await AsyncStorage.getItem(STORAGE_KEYS.FOOD_HISTORY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting food history:', error);
      return [];
    }
  },

  async saveFoodHistory(history: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FOOD_HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving food history:', error);
    }
  },
}; 