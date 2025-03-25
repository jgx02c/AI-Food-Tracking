export interface FoodEntry {
  id: string;
  timestamp: number;
  imageUrl: string;
  description: string;
  calories: number;
  nutrients: {
    protein: number;
    carbs: number;
    fat: number;
  };
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