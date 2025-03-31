import { NavigatorScreenParams } from '@react-navigation/native';

export type RootTabParamList = {
  Home: undefined;
  Goals: undefined;
  Workout: undefined;
  FoodEntries: undefined;
  PicList: undefined;
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
};

export type MainTabParamList = {
  Home: undefined;
  Goals: undefined;
  Workout: undefined;
  FoodEntries: undefined;
  PicList: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 