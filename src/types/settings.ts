export interface UserSettings {
  dailyCalorieGoal: number;
  dailyProteinGoal: number;
  weightGoal: number;
  notifications: {
    enabled: boolean;
    reminders: {
      meals: boolean;
      workouts: boolean;
      water: boolean;
    };
  };
  theme: 'light' | 'dark' | 'system';
  units: {
    weight: 'kg' | 'lbs';
    height: 'cm' | 'ft';
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  height?: number;
  weight?: number;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
} 