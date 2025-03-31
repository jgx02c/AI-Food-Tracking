import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  WorkoutTemplate, 
  ActiveWorkout, 
  CompletedExercise, 
  WorkoutExercise,
  CompletedSet,
  WorkoutSession,
  UserSettings,
  WorkoutEntry
} from '../types/workout';

const STORAGE_KEYS = {
  WORKOUT_TEMPLATES: 'workout_templates',
  ACTIVE_WORKOUT: 'active_workout',
  COMPLETED_WORKOUTS: 'completed_workouts',
  PICLIST_KEY: 'piclist_key',
  FOOD_HISTORY: 'food_history',
  USER_GOALS: 'user_goals',
};

const COMPLETED_WORKOUTS_KEY = '@completed_workouts';

interface UserGoals {
  weight: string;
  targetWeight: string;
  calorieGoal: string;
  proteinGoal: string;
  carbsGoal: string;
  fatGoal: string;
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
  imageUrl?: string;
}

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

  async saveWorkoutTemplate(template: WorkoutTemplate): Promise<void> {
    try {
      const templates = await this.getWorkoutTemplates();
      const index = templates.findIndex(t => t.id === template.id);
      if (index >= 0) {
        templates[index] = template;
      } else {
        templates.push(template);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.WORKOUT_TEMPLATES, JSON.stringify(templates));
    } catch (error) {
      console.error('Error saving workout template:', error);
    }
  },

  async deleteWorkoutTemplate(id: string): Promise<void> {
    try {
      const templates = await this.getWorkoutTemplates();
      const filtered = templates.filter(template => template.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.WORKOUT_TEMPLATES, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting workout template:', error);
    }
  },

  // Active Workout
  async createActiveWorkout(templateId: string): Promise<ActiveWorkout | null> {
    try {
      const templates = await this.getWorkoutTemplates();
      const template = templates.find(t => t.id === templateId);
      
      if (!template) {
        console.error('Template not found');
        return null;
      }

      const activeWorkout: ActiveWorkout = {
        id: Date.now().toString(),
        templateId,
        template,
        startTime: new Date(),
        exercises: template.exercises.map(exercise => ({
          exerciseId: exercise.exerciseId,
          name: exercise.name,
          sets: []
        })),
        status: 'inProgress'
      };

      await this.saveActiveWorkout(activeWorkout);
      return activeWorkout;
    } catch (error) {
      console.error('Error creating active workout:', error);
      return null;
    }
  },

  async saveActiveWorkout(workout: ActiveWorkout | null): Promise<void> {
    try {
      if (!workout) {
        await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
        return;
      }
      
      const workoutToSave = {
        ...workout,
        startTime: workout.startTime.toISOString(),
        endTime: workout.endTime?.toISOString(),
        template: workout.template
      };
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(workoutToSave));
    } catch (error) {
      console.error('Error saving active workout:', error);
    }
  },

  async getActiveWorkout(): Promise<ActiveWorkout | null> {
    try {
      const workout = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT);
      if (!workout) return null;
      
      const parsedWorkout = JSON.parse(workout);
      return {
        ...parsedWorkout,
        startTime: new Date(parsedWorkout.startTime),
        endTime: parsedWorkout.endTime ? new Date(parsedWorkout.endTime) : undefined,
      };
    } catch (error) {
      console.error('Error getting active workout:', error);
      return null;
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

  // User Goals
  async getUserGoals(): Promise<UserGoals | null> {
    try {
      const goals = await AsyncStorage.getItem(STORAGE_KEYS.USER_GOALS);
      return goals ? JSON.parse(goals) : null;
    } catch (error) {
      console.error('Error getting user goals:', error);
      return null;
    }
  },

  async saveUserGoals(goals: UserGoals): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_GOALS, JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving user goals:', error);
    }
  },

  // Food Entries
  async getFoodEntries(): Promise<FoodEntry[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FOOD_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting food entries:', error);
      return [];
    }
  },

  async addFoodEntry(entry: FoodEntry): Promise<void> {
    try {
      const entries = await this.getFoodEntries();
      entries.push(entry);
      await AsyncStorage.setItem(STORAGE_KEYS.FOOD_HISTORY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error adding food entry:', error);
    }
  },

  async deleteFoodEntry(id: string): Promise<void> {
    try {
      const entries = await this.getFoodEntries();
      const filtered = entries.filter(entry => entry.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.FOOD_HISTORY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting food entry:', error);
    }
  },

  // Workout Sessions
  async getWorkoutSessions(): Promise<WorkoutSession[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FOOD_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting workout sessions:', error);
      return [];
    }
  },

  async saveWorkoutSession(session: WorkoutSession): Promise<void> {
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
  },

  // User Settings
  async getUserSettings(): Promise<UserSettings | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FOOD_HISTORY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user settings:', error);
      return null;
    }
  },

  async saveUserSettings(settings: UserSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FOOD_HISTORY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving user settings:', error);
    }
  },

  async saveCompletedWorkout(workout: ActiveWorkout): Promise<void> {
    try {
      const completedWorkouts = await this.getCompletedWorkouts();
      const workoutToSave: ActiveWorkout = {
        ...workout,
        startTime: new Date(workout.startTime),
        endTime: workout.endTime ? new Date(workout.endTime) : undefined,
        template: {
          ...workout.template,
          exercises: workout.template.exercises.map(exercise => ({
            ...exercise,
            sets: exercise.sets
          }))
        }
      };
      completedWorkouts.push(workoutToSave);
      await AsyncStorage.setItem(COMPLETED_WORKOUTS_KEY, JSON.stringify(completedWorkouts));
      await this.saveActiveWorkout(null); // Clear the active workout
    } catch (error) {
      console.error('Error saving completed workout:', error);
      throw error;
    }
  },

  async getCompletedWorkouts(): Promise<ActiveWorkout[]> {
    try {
      const data = await AsyncStorage.getItem(COMPLETED_WORKOUTS_KEY);
      if (!data) return [];
      
      const workouts = JSON.parse(data);
      return workouts.map((workout: any) => ({
        ...workout,
        startTime: new Date(workout.startTime),
        endTime: workout.endTime ? new Date(workout.endTime) : undefined,
      }));
    } catch (error) {
      console.error('Error getting completed workouts:', error);
      return [];
    }
  },

  async deleteWorkout(workoutId: string): Promise<void> {
    try {
      const workouts = await this.getCompletedWorkouts();
      const filtered = workouts.filter(workout => workout.id !== workoutId);
      await AsyncStorage.setItem(COMPLETED_WORKOUTS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw error;
    }
  },

  async getWorkoutHistory(): Promise<WorkoutEntry[]> {
    try {
      const completedWorkouts = await this.getCompletedWorkouts();
      return completedWorkouts
        .filter(workout => workout.template) // Filter out any workouts without template data
        .map(workout => ({
          date: workout.startTime.toISOString(),
          name: workout.template.name,
          duration: Math.round((new Date(workout.endTime || new Date()).getTime() - new Date(workout.startTime).getTime()) / 60000),
          calories: workout.template.calories || 0,
          type: 'workout' as const
        }));
    } catch (error) {
      console.error('Error getting workout history:', error);
      return [];
    }
  },
}; 