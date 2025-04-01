import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService } from './storage';
import { FoodEntry } from './storage';
import { WorkoutSession } from '../types/workout';

export interface Goal {
  id: string;
  title: string;
  type: 'food' | 'workout' | 'weight';
  target: number;
  current: number;
  startDate: string;
  endDate: string;
  unit: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  category: 'maintenance' | 'improvement';
  isActive: boolean;
}

const GOALS_KEY = '@goals';

export class GoalsService {
  private static instance: GoalsService;

  private constructor() {}

  public static getInstance(): GoalsService {
    if (!GoalsService.instance) {
      GoalsService.instance = new GoalsService();
    }
    return GoalsService.instance;
  }

  async getGoals(): Promise<Goal[]> {
    try {
      const goalsJson = await AsyncStorage.getItem(GOALS_KEY);
      return goalsJson ? JSON.parse(goalsJson) : [];
    } catch (error) {
      console.error('Error getting goals:', error);
      return [];
    }
  }

  async getActiveGoals(): Promise<Goal[]> {
    try {
      const goals = await this.getGoals();
      return goals.filter(goal => goal.isActive);
    } catch (error) {
      console.error('Error getting active goals:', error);
      return [];
    }
  }

  async saveGoal(goal: Goal): Promise<void> {
    try {
      const goals = await this.getGoals();
      const existingIndex = goals.findIndex(g => g.id === goal.id);
      
      console.log('Saving goal:', {
        id: goal.id,
        type: goal.type,
        isActive: goal.isActive,
        isNew: existingIndex === -1,
        startDate: goal.startDate
      });
      
      // If this is a weight goal and it's being set as active, deactivate other weight goals
      if (goal.type === 'weight' && goal.isActive) {
        goals.forEach(g => {
          if (g.type === 'weight' && g.id !== goal.id) {
            g.isActive = false;
          }
        });
      }
      
      // If this is a new goal and it's active, sync with today's entries
      if (existingIndex === -1 && goal.isActive) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString();
        
        // Check if the goal's start date is today
        const goalStartDate = new Date(goal.startDate);
        goalStartDate.setHours(0, 0, 0, 0);
        
        console.log('Date comparison:', {
          today: todayStr,
          goalStartDate: goalStartDate.toISOString(),
          isToday: goalStartDate.toISOString() === todayStr
        });
        
        if (goalStartDate.toISOString() === todayStr) {
          switch (goal.type) {
            case 'food':
              const foodHistory = await StorageService.getFoodHistory();
              console.log('All food entries:', foodHistory);
              
              const todayFoodEntries = foodHistory.filter(entry => {
                const entryDate = new Date(entry.date);
                entryDate.setHours(0, 0, 0, 0);
                return entryDate.toISOString() === todayStr;
              });
              console.log('Today\'s food entries:', todayFoodEntries);
              
              const totalCalories = todayFoodEntries.reduce((sum, entry) => sum + entry.calories, 0);
              console.log('Total calories for today:', totalCalories);
              goal.current = totalCalories;
              break;
              
            case 'workout':
              const workoutSessions = await StorageService.getWorkoutSessions();
              console.log('All workout sessions:', workoutSessions);
              
              const todayWorkouts = workoutSessions.filter(session => {
                const sessionDate = new Date(session.date);
                sessionDate.setHours(0, 0, 0, 0);
                return sessionDate.toISOString() === todayStr;
              });
              console.log('Today\'s workouts:', todayWorkouts);
              
              goal.current = todayWorkouts.length;
              break;
              
            case 'weight':
              // Weight goals are updated manually through the settings screen
              break;
          }
        }
      }
      
      if (existingIndex >= 0) {
        goals[existingIndex] = goal;
      } else {
        goals.push(goal);
      }
      
      console.log('Final goal state:', goal);
      await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving goal:', error);
      throw error;
    }
  }

  async deleteGoal(goalId: string): Promise<void> {
    try {
      const goals = await this.getGoals();
      const filteredGoals = goals.filter(goal => goal.id !== goalId);
      await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(filteredGoals));
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  }

  async getDailyGoals(): Promise<Goal[]> {
    try {
      const goals = await this.getActiveGoals();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return goals.filter(goal => {
        const startDate = new Date(goal.startDate);
        const endDate = new Date(goal.endDate);
        return today >= startDate && today <= endDate;
      });
    } catch (error) {
      console.error('Error getting daily goals:', error);
      return [];
    }
  }

  async createDefaultGoals(): Promise<void> {
    try {
      const existingGoals = await this.getGoals();
      if (existingGoals.length > 0) return;

      const defaultGoals: Goal[] = [
        {
          id: '1',
          title: 'Daily Calorie Goal',
          type: 'food',
          target: 2000,
          current: 0,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          unit: 'calories',
          frequency: 'daily',
          category: 'maintenance',
          isActive: true,
        },
        {
          id: '2',
          title: 'Weekly Workouts',
          type: 'workout',
          target: 3,
          current: 0,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          unit: 'workouts',
          frequency: 'weekly',
          category: 'improvement',
          isActive: true,
        },
      ];

      await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(defaultGoals));
    } catch (error) {
      console.error('Error creating default goals:', error);
      throw error;
    }
  }

  async updateGoalProgress(goalId: string, progress: number): Promise<void> {
    try {
      const goals = await this.getGoals();
      const goalIndex = goals.findIndex(g => g.id === goalId);
      
      if (goalIndex >= 0) {
        goals[goalIndex].current = progress;
        await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(goals));
      }
    } catch (error) {
      console.error('Error updating goal progress:', error);
      throw error;
    }
  }

  async updateTodayProgress(): Promise<void> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString();
      
      const goals = await this.getActiveGoals();
      const foodEntries = await StorageService.getFoodEntries();
      const workoutSessions = await StorageService.getWorkoutSessions();

      // Filter today's entries
      const todayFoodEntries = foodEntries.filter((entry: FoodEntry) => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.toISOString() === todayStr;
      });

      const todayWorkouts = workoutSessions.filter((session: WorkoutSession) => {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.toISOString() === todayStr;
      });

      // Update progress for each goal
      for (const goal of goals) {
        switch (goal.type) {
          case 'food':
            const totalCalories = todayFoodEntries.reduce((sum: number, entry: FoodEntry) => sum + entry.calories, 0);
            await this.updateGoalProgress(goal.id, totalCalories);
            break;
          case 'workout':
            await this.updateGoalProgress(goal.id, todayWorkouts.length);
            break;
          case 'weight':
            // Weight goals are updated manually through the settings screen
            break;
        }
      }
    } catch (error) {
      console.error('Error updating today\'s progress:', error);
      throw error;
    }
  }
}

export default GoalsService.getInstance(); 