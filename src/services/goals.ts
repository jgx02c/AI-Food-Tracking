import AsyncStorage from '@react-native-async-storage/async-storage';

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
}

const GOALS_KEY = '@goals';

class GoalsService {
  async getGoals(): Promise<Goal[]> {
    try {
      const goalsJson = await AsyncStorage.getItem(GOALS_KEY);
      return goalsJson ? JSON.parse(goalsJson) : [];
    } catch (error) {
      console.error('Error getting goals:', error);
      return [];
    }
  }

  async saveGoal(goal: Goal): Promise<void> {
    try {
      const goals = await this.getGoals();
      const existingIndex = goals.findIndex(g => g.id === goal.id);
      
      if (existingIndex >= 0) {
        goals[existingIndex] = goal;
      } else {
        goals.push(goal);
      }
      
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
      const goals = await this.getGoals();
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
}

export default new GoalsService(); 