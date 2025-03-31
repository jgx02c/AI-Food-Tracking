export type MuscleGroup = 
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'legs'
  | 'core'
  | 'full-body'
  | 'cardio';

export type Equipment = 
  | 'bodyweight'
  | 'barbell'
  | 'dumbbell'
  | 'kettlebell'
  | 'machine'
  | 'cable'
  | 'resistanceBand'
  | 'other';

export interface Exercise {
  id: string;
  name: string;
  muscleGroups: MuscleGroup[];
  equipment: Equipment[];
  description: string;
  instructions: string[];
  tips?: string[];
  videoUrl?: string;
  imageUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface ExerciseSet {
  reps: number;
  weight?: number;
  duration?: number; // in seconds, for timed exercises
  completed: boolean;
  notes?: string;
}

export interface WorkoutSet {
  reps: number;
  weight?: number; // Target weight
  actualWeight?: number; // Actual weight used
  actualReps?: number; // Actual reps performed
  completed: boolean;
  isFailure?: boolean; // Whether the set was completed to failure
  notes?: string; // Optional notes about the set
}

export interface WorkoutExercise {
  exerciseId: string;
  name: string;
  sets: {
    reps: number;
    weight: number;
    restTime: number;
  }[];
  notes?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  calories: number;
}

export interface CompletedSet {
  reps: number;
  weight?: number;
  actualWeight?: number;
  actualReps?: number;
  completed: boolean;
  isFailure?: boolean;
}

export interface CompletedExercise {
  exerciseId: string;
  name: string;
  sets: CompletedSet[];
}

export interface ActiveWorkout {
  id: string;
  templateId: string;
  template: WorkoutTemplate;
  startTime: Date;
  endTime?: Date;
  exercises: CompletedExercise[];
  status: 'inProgress' | 'completed' | 'cancelled';
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  templateId: string;
  date: string;
  exercises: CompletedExercise[];
  duration: number;
}

export interface UserSettings {
  dailyCalorieGoal: number;
  dailyProteinGoal: number;
  weightGoal: number;
}

export interface WorkoutEntry {
  date: string;
  name: string;
  duration: number;
  calories: number;
  type: 'workout';
} 