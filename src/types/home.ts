import { Goal } from '../services/goals';
import { FoodEntry } from './index';
import { WorkoutEntry, ActiveWorkout } from './workout';

export interface UserGoals {
  calorieGoal: string;
  proteinGoal: string;
  carbsGoal: string;
  fatGoal: string;
  weight: string;
  targetWeight: string;
}

export interface Stats {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface StatsGoals {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

export interface ActiveGoalsSectionProps {
  goals: Goal[];
  onGoalPress: (goalId: string) => void;
}

export interface WeightProgressSectionProps {
  currentWeight: string;
  targetWeight: string;
  onPress: () => void;
}

export interface WorkoutsProgressSectionProps {
  todayWorkouts: WorkoutEntry[];
  completedWorkouts: ActiveWorkout[];
  onPress: () => void;
}

export interface StatsProgressSectionProps {
  stats: Stats;
  goals: StatsGoals;
}

export interface FoodEntriesProgressSectionProps {
  entries: FoodEntry[];
  onPress: () => void;
} 