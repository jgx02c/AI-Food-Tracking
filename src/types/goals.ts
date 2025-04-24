export interface UserGoals {
  weight: string;
  targetWeight: string;
  calorieGoal: string;
  proteinGoal: string;
  carbsGoal: string;
  fatGoal: string;
}

export type GoalType = 'weight' | 'bulk' | 'cut' | 'food' | 'workout';

export interface Goal {
  id: string;
  type: GoalType;
  name: string;
  target: number;
  current: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  notes?: string;
  unit?: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  category?: 'maintenance' | 'improvement';
}

export interface GoalProgress {
  goalId: string;
  date: string;
  value: number;
}

export interface GoalCardProps {
  goal: Goal;
  onPress: (goalId: string) => void;
  onDelete?: (goalId: string) => void;
}

export interface GoalListProps {
  goals: Goal[];
  onGoalPress: (goalId: string) => void;
  onGoalDelete?: (goalId: string) => void;
}

export interface GoalFormData {
  type: GoalType;
  name: string;
  target: number;
  startDate: string;
  endDate: string;
  notes?: string;
  unit?: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  category?: 'maintenance' | 'improvement';
}

export interface GoalFormProps {
  onSubmit: (data: GoalFormData) => void;
  initialData?: Partial<GoalFormData>;
}

export interface GoalDetailsProps {
  goal: Goal;
  progress: GoalProgress[];
  onEdit: () => void;
  onDelete: () => void;
} 