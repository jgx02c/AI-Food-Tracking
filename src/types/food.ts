export interface Nutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodEntry extends Nutrients {
  id: string;
  name: string;
  date: string;
  imageUrl?: string;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  notes?: string;
}

export interface FoodPrediction {
  name: string;
  confidence: number;
  nutrients: Nutrients;
}

export interface FoodAnalysisResult {
  predictions: FoodPrediction[];
  imageUrl?: string;
}

export interface FoodHistoryEntry extends FoodEntry {
  timestamp: number;
}

export interface DailyNutrients extends Nutrients {
  date: string;
  entries: FoodEntry[];
} 