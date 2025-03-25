export type MuscleGroup = 
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'legs'
  | 'core'
  | 'fullBody'
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

export interface WorkoutExercise {
  exerciseId: string;
  name: string;
  sets: ExerciseSet[];
  notes?: string;
  restTime: number; // in seconds
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
  notes?: string;
  status: 'inProgress' | 'completed' | 'cancelled';
} 