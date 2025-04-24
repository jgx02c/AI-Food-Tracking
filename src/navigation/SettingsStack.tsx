import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsHomeScreen from '../screens/settings/SettingsHomeScreen';
import ProfileScreen from '../screens/settings/ProfileScreen';
import NotificationsSettingsScreen from '../screens/settings/NotificationsSettingsScreen';
import BackupSettingsScreen from '../screens/settings/BackupSettingsScreen';
import PicListSettingsScreen from '../screens/settings/PicListSettingsScreen';
import AboutSettingsScreen from '../screens/settings/AboutSettingsScreen';
import LegalSettingsScreen from '../screens/settings/LegalSettingsScreen';

export type SettingsStackParamList = {
  SettingsHome: undefined;
  Profile: undefined;
  NotificationsSettings: undefined;
  BackupSettings: undefined;
  PicListSettings: undefined;
  AboutSettings: undefined;
  LegalSettings: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

const SettingsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingsHome"
        component={SettingsHomeScreen}
        options={{
          title: 'Settings',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
      <Stack.Screen
        name="NotificationsSettings"
        component={NotificationsSettingsScreen}
        options={{
          title: 'Notifications',
        }}
      />
      <Stack.Screen
        name="BackupSettings"
        component={BackupSettingsScreen}
        options={{
          title: 'Backup & Restore',
        }}
      />
      <Stack.Screen
        name="PicListSettings"
        component={PicListSettingsScreen}
        options={{
          title: 'Food Recognition',
        }}
      />
      <Stack.Screen
        name="AboutSettings"
        component={AboutSettingsScreen}
        options={{
          title: 'About',
        }}
      />
      <Stack.Screen
        name="LegalSettings"
        component={LegalSettingsScreen}
        options={{
          title: 'Legal',
        }}
      />
    </Stack.Navigator>
  );
};

export default SettingsStack; 