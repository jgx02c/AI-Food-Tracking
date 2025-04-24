import { FoodEntry } from './food';
import { WorkoutEntry, ActiveWorkout } from './workout';

// Food Component Props
export interface FoodEntryItemProps {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  onDelete: () => void;
}

export interface FoodEntriesSectionProps {
  entries: FoodEntry[];
  onPress: () => void;
}

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

export interface MealTypeSelectorProps {
  selectedMeal: MealType;
  onMealSelect: (meal: MealType) => void;
}

export type ServingUnit = 'g' | 'ml' | 'oz';

export interface ServingUnitSelectorProps {
  selectedUnit: ServingUnit;
  onUnitChange: (unit: ServingUnit) => void;
}

export interface TimePickerModalProps {
  visible: boolean;
  selectedTime: Date;
  onClose: () => void;
  onTimeChange: (event: any, selectedDate?: Date) => void;
}

// History Component Props
export interface DailySummaryProps {
  date: Date;
  foodEntries: FoodEntry[];
  workouts: ActiveWorkout[];
  streak: number;
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface FoodEntryCardProps {
  entry: FoodEntry;
}

export interface ProgressItemProps {
  label: string;
  current: number;
  goal: number;
  unit?: string;
}

export interface StreakCardProps {
  label: string;
  value: number;
}

export interface WorkoutCardProps {
  workout: ActiveWorkout;
}

// Home Component Props
export interface HeaderProps {
  title: string;
  date: string;
}

export interface StatsSectionProps {
  stats: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  goals: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
}

export interface WeightSectionProps {
  currentWeight: string;
  targetWeight: string;
  onPress: () => void;
}

export interface WorkoutsSectionProps {
  todayWorkouts: WorkoutEntry[];
  completedWorkouts: ActiveWorkout[];
  onPress: () => void;
} 