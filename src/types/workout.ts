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
  sets: WorkoutSet[];
  restTime: number; // in seconds
  notes?: string; // Optional notes about the exercise
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  exercises: WorkoutExercise[];
  estimatedDuration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscleGroups: MuscleGroup[];
}

export interface ActiveWorkout {
  id: string;
  templateId: string;
  startTime: Date;
  endTime?: Date;
  exercises: WorkoutExercise[];
  status: 'inProgress' | 'completed' | 'cancelled';
  notes?: string; // Optional notes about the workout
}

export interface WorkoutSession extends ActiveWorkout {
  date: string;
  duration: number; // in seconds
} 