export interface Nutrients {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodEntry {
  id: string;
  timestamp: number;
  imageUrl: string;
  description: string;
  calories: number;
  nutrients: Nutrients;
  servingSize: string;
  mealType: MealType;
  userId?: string;
} 