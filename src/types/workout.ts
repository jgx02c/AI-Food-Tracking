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
  weight?: number;
  actualWeight?: number;
  actualReps?: number;
  completed: boolean;
  isFailure?: boolean;
  notes?: string;
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

export interface CompletedSet extends WorkoutSet {}

export interface CompletedExercise {
  exerciseId: string;
  name: string;
  sets: CompletedSet[];
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  calories: number;
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

export interface WorkoutEntry {
  date: string;
  name: string;
  duration: number;
  calories: number;
  type: 'workout';
  totalWeight: number;
}

// Navigation Types
export interface WorkoutStackParamList {
  WorkoutHome: undefined;
  WorkoutTemplate: { templateId?: string };
  ActiveWorkout: { workoutId: string };
  WorkoutCompletion: { workoutId: string };
  WorkoutDetails: { workoutId: string };
} 