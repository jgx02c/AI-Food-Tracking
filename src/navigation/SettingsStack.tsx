import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../types/navigation';

// Import screens
import SettingsHomeScreen from '../screens/settings/SettingsHomeScreen';
import PicListSettingsScreen from '../screens/settings/PicListSettingsScreen';
import NotificationsSettingsScreen from '../screens/settings/NotificationsSettingsScreen';
import BackupSettingsScreen from '../screens/settings/BackupSettingsScreen';
import AboutSettingsScreen from '../screens/settings/AboutSettingsScreen';
import LegalSettingsScreen from '../screens/settings/LegalSettingsScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

const SettingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SettingsHome" component={SettingsHomeScreen} />
      <Stack.Screen name="PicListSettings" component={PicListSettingsScreen} />
      <Stack.Screen name="NotificationsSettings" component={NotificationsSettingsScreen} />
      <Stack.Screen name="BackupSettings" component={BackupSettingsScreen} />
      <Stack.Screen name="AboutSettings" component={AboutSettingsScreen} />
      <Stack.Screen name="LegalSettings" component={LegalSettingsScreen} />
    </Stack.Navigator>
  );
};

export default SettingsStack; 