import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  WorkoutTemplate, 
  ActiveWorkout, 
  CompletedExercise, 
  WorkoutExercise,
  CompletedSet,
  WorkoutSession,
  WorkoutEntry
} from '../types/workout';
import { UserSettings, UserProfile } from '../types/settings';
import { FoodEntry } from '../types/food';
import { Goal } from '../types/goals';

const TEMPLATES_KEY = 'workoutTemplates';
const COMPLETED_WORKOUTS_KEY = 'completedWorkouts';
const ACTIVE_WORKOUT_KEY = 'activeWorkout';
const USER_SETTINGS_KEY = 'user_settings';
const USER_PROFILE_KEY = 'user_profile';
const FOOD_HISTORY_KEY = 'food_history';
const GOALS_KEY = 'goals';

const STORAGE_KEYS = {
  WORKOUT_TEMPLATES: TEMPLATES_KEY,
  ACTIVE_WORKOUT: ACTIVE_WORKOUT_KEY,
  COMPLETED_WORKOUTS: COMPLETED_WORKOUTS_KEY,
  PICLIST_KEY: 'piclist_key',
  FOOD_HISTORY: FOOD_HISTORY_KEY,
  USER_GOALS: GOALS_KEY,
};


export class StorageService {
  static async getWorkoutTemplates(): Promise<WorkoutTemplate[]> {
    try {
      console.log('Getting templates from storage...');
      const templates = await AsyncStorage.getItem(TEMPLATES_KEY);
      console.log('Raw templates from storage:', templates);
      const parsedTemplates = templates ? JSON.parse(templates) : [];
      console.log('Parsed templates:', parsedTemplates);
      return parsedTemplates;
    } catch (error) {
      console.error('Error getting workout templates:', error);
      return [];
    }
  }

  static async saveWorkoutTemplate(template: WorkoutTemplate): Promise<void> {
    try {
      console.log('Saving template:', template);
      const templates = await this.getWorkoutTemplates();
      const existingIndex = templates.findIndex(t => t.id === template.id);
      
      if (existingIndex >= 0) {
        templates[existingIndex] = template;
      } else {
        templates.push(template);
      }
      
      console.log('Saving templates array:', templates);
      await AsyncStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
      console.log('Template saved successfully');
    } catch (error) {
      console.error('Error saving workout template:', error);
      throw error;
    }
  }

  static async deleteWorkoutTemplate(templateId: string): Promise<void> {
    try {
      const templates = await this.getWorkoutTemplates();
      const filteredTemplates = templates.filter(t => t.id !== templateId);
      await AsyncStorage.setItem(TEMPLATES_KEY, JSON.stringify(filteredTemplates));
    } catch (error) {
      console.error('Error deleting workout template:', error);
      throw error;
    }
  }

  static async getCompletedWorkouts(): Promise<ActiveWorkout[]> {
    try {
      const workouts = await AsyncStorage.getItem(COMPLETED_WORKOUTS_KEY);
      if (!workouts) return [];
      
      const parsedWorkouts = JSON.parse(workouts);
      return parsedWorkouts.map((workout: ActiveWorkout) => ({
        ...workout,
        startTime: new Date(workout.startTime),
        endTime: workout.endTime ? new Date(workout.endTime) : undefined
      }));
    } catch (error) {
      console.error('Error getting completed workouts:', error);
      return [];
    }
  }

  static async saveCompletedWorkout(workout: ActiveWorkout): Promise<void> {
    try {
      const workouts = await this.getCompletedWorkouts();
      workouts.push(workout);
      await AsyncStorage.setItem(COMPLETED_WORKOUTS_KEY, JSON.stringify(workouts));
    } catch (error) {
      console.error('Error saving completed workout:', error);
      throw error;
    }
  }

  static async deleteWorkout(workoutId: string): Promise<void> {
    try {
      const workouts = await this.getCompletedWorkouts();
      const filteredWorkouts = workouts.filter(w => w.id !== workoutId);
      await AsyncStorage.setItem(COMPLETED_WORKOUTS_KEY, JSON.stringify(filteredWorkouts));
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw error;
    }
  }

  static async getActiveWorkout(): Promise<ActiveWorkout | null> {
    try {
      const workout = await AsyncStorage.getItem(ACTIVE_WORKOUT_KEY);
      if (workout) {
        const parsedWorkout = JSON.parse(workout);
        // Convert string dates back to Date objects
        parsedWorkout.startTime = new Date(parsedWorkout.startTime);
        if (parsedWorkout.endTime) {
          parsedWorkout.endTime = new Date(parsedWorkout.endTime);
        }
        return parsedWorkout;
      }
      return null;
    } catch (error) {
      console.error('Error getting active workout:', error);
      return null;
    }
  }

  static async saveActiveWorkout(workout: ActiveWorkout): Promise<void> {
    try {
      await AsyncStorage.setItem(ACTIVE_WORKOUT_KEY, JSON.stringify(workout));
    } catch (error) {
      console.error('Error saving active workout:', error);
      throw error;
    }
  }

  static async clearActiveWorkout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ACTIVE_WORKOUT_KEY);
    } catch (error) {
      console.error('Error clearing active workout:', error);
      throw error;
    }
  }

  // Piclist API Key
  static async getPiclistKey(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.PICLIST_KEY);
    } catch (error) {
      console.error('Error getting Piclist key:', error);
      return null;
    }
  }

  static async savePiclistKey(key: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PICLIST_KEY, key);
    } catch (error) {
      console.error('Error saving Piclist key:', error);
    }
  }

  // Food History
  static async getFoodHistory(): Promise<any[]> {
    try {
      const history = await AsyncStorage.getItem(STORAGE_KEYS.FOOD_HISTORY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting food history:', error);
      return [];
    }
  }

  static async saveFoodHistory(history: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FOOD_HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving food history:', error);
    }
  }

  // User Goals
  static async getUserGoals(): Promise<UserGoals | null> {
    try {
      const goals = await AsyncStorage.getItem(STORAGE_KEYS.USER_GOALS);
      return goals ? JSON.parse(goals) : null;
    } catch (error) {
      console.error('Error getting user goals:', error);
      return null;
    }
  }

  static async saveUserGoals(goals: UserGoals): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_GOALS, JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving user goals:', error);
    }
  }

  // Food Entries
  static async getFoodEntries(): Promise<FoodEntry[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FOOD_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting food entries:', error);
      return [];
    }
  }

  static async addFoodEntry(entry: FoodEntry): Promise<void> {
    try {
      const entries = await this.getFoodEntries();
      entries.push(entry);
      await AsyncStorage.setItem(STORAGE_KEYS.FOOD_HISTORY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error adding food entry:', error);
    }
  }

  static async deleteFoodEntry(id: string): Promise<void> {
    try {
      const entries = await this.getFoodEntries();
      const filtered = entries.filter(entry => entry.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.FOOD_HISTORY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting food entry:', error);
    }
  }

  // Workout Sessions
  static async getWorkoutSessions(): Promise<WorkoutSession[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FOOD_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting workout sessions:', error);
      return [];
    }
  }

  static async saveWorkoutSession(session: WorkoutSession): Promise<void> {
    try {
      const sessions = await this.getWorkoutSessions();
      const index = sessions.findIndex(s => s.id === session.id);
      if (index >= 0) {
        sessions[index] = session;
      } else {
        sessions.push(session);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.FOOD_HISTORY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving workout session:', error);
    }
  }

  // User Settings
  static async getUserSettings(): Promise<UserSettings | null> {
    try {
      const data = await AsyncStorage.getItem(USER_SETTINGS_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user settings:', error);
      return null;
    }
  }

  static async saveUserSettings(settings: UserSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving user settings:', error);
    }
  }

  static async getUserProfile(): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(USER_PROFILE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  static async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  }

  static async getWorkoutHistory(): Promise<WorkoutEntry[]> {
    try {
      const completedWorkouts = await this.getCompletedWorkouts();
      return completedWorkouts
        .filter(workout => workout.template) // Filter out any workouts without template data
        .map(workout => {
          // Calculate total weight lifted
          const totalWeight = workout.exercises.reduce((total, exercise) => {
            return total + exercise.sets.reduce((setTotal, set) => {
              return setTotal + (set.actualWeight || 0) * (set.actualReps || 0);
            }, 0);
          }, 0);

          // Ensure startTime is a Date object
          const startTime = new Date(workout.startTime);
          const endTime = workout.endTime ? new Date(workout.endTime) : new Date();

          return {
            date: startTime.toISOString(),
            name: workout.template.name,
            duration: Math.round((endTime.getTime() - startTime.getTime()) / 60000),
            calories: workout.template.calories || 0,
            type: 'workout' as const,
            totalWeight: Math.round(totalWeight)
          };
        });
    } catch (error) {
      console.error('Error getting workout history:', error);
      return [];
    }
  }
} 