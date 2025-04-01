import { Goal } from '../services/goals';

export type GoalType = 'weight' | 'bulk' | 'cut' | 'food' | 'workout';

export interface GoalCardProps {
  goal: Goal;
  onPress: (goalId: string) => void;
}

export interface GoalListProps {
  goals: Goal[];
  onGoalPress: (goalId: string) => void;
}

export interface GoalFormData {
  title: string;
  type: GoalType;
  target: string;
  startDate: string;
  endDate: string;
  unit: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  category: 'maintenance' | 'improvement';
}

export interface GoalFormProps {
  onSubmit: (data: GoalFormData) => void;
  initialData?: Partial<GoalFormData>;
  isEditing?: boolean;
}

export interface GoalDetailsProps {
  goal: Goal;
  onUpdate: (goalId: string, data: Partial<GoalFormData>) => void;
  onDelete: (goalId: string) => void;
} 