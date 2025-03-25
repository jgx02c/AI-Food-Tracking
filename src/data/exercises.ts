import { Exercise } from '../types/workout';

export const exercises: Exercise[] = [
  // Chest Exercises
  {
    id: 'bench-press',
    name: 'Bench Press',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    equipment: ['barbell', 'dumbbell'],
    description: 'A compound exercise that primarily targets the chest muscles while also working the shoulders and triceps.',
    instructions: [
      'Lie on a flat bench with your feet planted firmly on the ground',
      'Grip the barbell slightly wider than shoulder width',
      'Lower the bar to your chest while keeping your elbows at a 45-degree angle',
      'Push the bar back up to the starting position'
    ],
    tips: [
      'Keep your back flat against the bench',
      'Breathe out when pushing up, inhale when lowering',
      'Keep your wrists straight throughout the movement'
    ],
    difficulty: 'intermediate',
  },
  {
    id: 'push-ups',
    name: 'Push-Ups',
    muscleGroups: ['chest', 'shoulders', 'triceps', 'core'],
    equipment: ['bodyweight'],
    description: 'A classic bodyweight exercise that targets the chest, shoulders, and triceps while also engaging the core.',
    instructions: [
      'Start in a plank position with your hands slightly wider than shoulder width',
      'Keep your body straight from head to heels',
      'Lower your body until your chest nearly touches the ground',
      'Push back up to the starting position'
    ],
    tips: [
      'Keep your elbows close to your body',
      'Maintain a straight line from head to heels',
      'Breathe out when pushing up, inhale when lowering'
    ],
    difficulty: 'beginner',
  },

  // Back Exercises
  {
    id: 'pull-ups',
    name: 'Pull-Ups',
    muscleGroups: ['back', 'biceps', 'shoulders'],
    equipment: ['bodyweight'],
    description: 'A challenging bodyweight exercise that primarily targets the back muscles while also working the biceps and shoulders.',
    instructions: [
      'Hang from a pull-up bar with your hands slightly wider than shoulder width',
      'Pull yourself up until your chin is over the bar',
      'Lower yourself back down with control'
    ],
    tips: [
      'Engage your back muscles before pulling',
      'Keep your core tight throughout the movement',
      'Avoid swinging or using momentum'
    ],
    difficulty: 'advanced',
  },
  {
    id: 'bent-over-rows',
    name: 'Bent Over Rows',
    muscleGroups: ['back', 'biceps', 'shoulders'],
    equipment: ['barbell', 'dumbbell'],
    description: 'A compound exercise that targets the upper back muscles while also working the biceps and rear deltoids.',
    instructions: [
      'Stand with feet shoulder-width apart, holding weights in front of your thighs',
      'Hinge at your hips and bend forward until your torso is nearly parallel to the ground',
      'Pull the weights up to your lower chest, keeping your elbows close to your body',
      'Lower the weights back down with control'
    ],
    tips: [
      'Keep your back straight throughout the movement',
      'Pull your shoulder blades together at the top',
      'Maintain a neutral spine position'
    ],
    difficulty: 'intermediate',
  },

  // Leg Exercises
  {
    id: 'squats',
    name: 'Squats',
    muscleGroups: ['legs', 'core'],
    equipment: ['bodyweight', 'barbell', 'dumbbell'],
    description: 'A fundamental lower body exercise that targets the quadriceps, hamstrings, and glutes while also engaging the core.',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower your body by bending your knees and hips',
      'Keep your chest up and back straight',
      'Push back up to the starting position'
    ],
    tips: [
      'Keep your knees aligned with your toes',
      'Maintain a neutral spine position',
      'Breathe out when standing up, inhale when lowering'
    ],
    difficulty: 'beginner',
  },
  {
    id: 'deadlifts',
    name: 'Deadlifts',
    muscleGroups: ['back', 'legs', 'core'],
    equipment: ['barbell', 'dumbbell'],
    description: 'A compound exercise that targets multiple muscle groups including the back, legs, and core.',
    instructions: [
      'Stand with feet hip-width apart, barbell in front of your shins',
      'Bend at your hips and knees to grip the bar',
      'Keep your back straight and lift the bar by extending your hips and knees',
      'Lower the bar back down with control'
    ],
    tips: [
      'Keep your back straight throughout the movement',
      'Engage your core before lifting',
      'Lift with your legs, not your back'
    ],
    difficulty: 'advanced',
  },

  // Shoulder Exercises
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    muscleGroups: ['shoulders', 'triceps', 'core'],
    equipment: ['barbell', 'dumbbell'],
    description: 'A compound exercise that targets the shoulders while also working the triceps and core.',
    instructions: [
      'Stand with feet shoulder-width apart, holding weights at shoulder level',
      'Press the weights overhead until your arms are fully extended',
      'Lower the weights back down with control'
    ],
    tips: [
      'Keep your core tight throughout the movement',
      'Maintain a neutral spine position',
      'Breathe out when pressing up, inhale when lowering'
    ],
    difficulty: 'intermediate',
  },

  // Core Exercises
  {
    id: 'plank',
    name: 'Plank',
    muscleGroups: ['core'],
    equipment: ['bodyweight'],
    description: 'An isometric exercise that targets the core muscles while also engaging the shoulders and back.',
    instructions: [
      'Start in a push-up position with your forearms on the ground',
      'Keep your body straight from head to heels',
      'Hold this position'
    ],
    tips: [
      'Keep your hips level with your shoulders',
      'Engage your core throughout the hold',
      'Maintain a neutral spine position'
    ],
    difficulty: 'beginner',
  },
]; 