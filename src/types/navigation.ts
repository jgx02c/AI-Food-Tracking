import { NavigatorScreenParams } from '@react-navigation/native';

export type RootTabParamList = {
  Home: undefined;
  Goals: undefined;
  Workout: undefined;
  FoodEntries: undefined;
  Settings: undefined;
};

export type SettingsStackParamList = {
  SettingsHome: undefined;
  PicListSettings: undefined;
  NotificationsSettings: undefined;
  BackupSettings: undefined;
  AboutSettings: undefined;
  LegalSettings: undefined;
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
};

export type MainTabParamList = {
  Home: undefined;
  Goals: undefined;
  Workout: undefined;
  FoodEntries: undefined;
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 