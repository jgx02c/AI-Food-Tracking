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

export interface UserStats {
  weight: number;
  goalWeight: number;
  dailyCalorieGoal: number;
  entries: { [date: string]: FoodEntry[] };
}

export interface DayStats {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  entries: FoodEntry[];
} 