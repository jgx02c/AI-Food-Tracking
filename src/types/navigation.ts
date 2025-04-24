import { NavigatorScreenParams } from '@react-navigation/native';
import { WorkoutStackParamList } from './workout';
import { HomeStackParamList } from '../navigation/HomeStack';
import { FoodEntry } from './food';

export interface SettingsStackParamList {
  SettingsHome: undefined;
  UserProfile: undefined;
  Preferences: undefined;
  About: undefined;
}

export interface FoodStackParamList {
  FoodHome: undefined;
  Camera: undefined;
  FoodLoading: { imageUri: string };
  FoodReview: { predictions: FoodEntry[] };
  FoodEntry: { entry?: FoodEntry };
}

export interface GoalsStackParamList {
  GoalsHome: undefined;
  CreateGoal: undefined;
  GoalDetails: { goalId: string };
}

export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Goals: undefined;
  Workout: NavigatorScreenParams<WorkoutStackParamList>;
  FoodEntries: undefined;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

export interface RootStackParamList {
  Home: undefined;
  Settings: undefined;
  Goals: undefined;
  Workout: undefined;
  Food: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  WorkoutDetails: { workoutId: string };
  ManualFoodEntry: undefined;
  History: { date: string };
  CreateGoal: undefined;
  GoalDetails: { goalId: string };
  SettingsStack: NavigatorScreenParams<SettingsStackParamList>;
  PicListSettings: undefined;
  NotificationsSettings: undefined;
  BackupSettings: undefined;
  AboutSettings: undefined;
  LegalSettings: undefined;
  AddWeight: undefined;
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 