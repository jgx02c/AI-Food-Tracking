import { NavigatorScreenParams } from '@react-navigation/native';
import { WorkoutStackParamList } from '../navigation/WorkoutStack';
import { HomeStackParamList } from '../navigation/HomeStack';

export type SettingsStackParamList = {
  SettingsHome: undefined;
  PicListSettings: undefined;
  NotificationsSettings: undefined;
  BackupSettings: undefined;
  AboutSettings: undefined;
  LegalSettings: undefined;
};

export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Goals: undefined;
  Workout: NavigatorScreenParams<WorkoutStackParamList>;
  FoodEntries: undefined;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  WorkoutDetails: { workoutId: string };
  Camera: undefined;
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
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 