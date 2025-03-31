import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SettingsHomeScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('PicListSettings')}
          >
            <Ionicons name="camera-outline" size={24} color="#2C3E50" />
            <Text style={styles.menuText}>PicList API Settings</Text>
            <Ionicons name="chevron-forward" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('NotificationsSettings')}
          >
            <Ionicons name="notifications-outline" size={24} color="#2C3E50" />
            <Text style={styles.menuText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('BackupSettings')}
          >
            <Ionicons name="cloud-upload-outline" size={24} color="#2C3E50" />
            <Text style={styles.menuText}>Backup & Restore</Text>
            <Ionicons name="chevron-forward" size={24} color="#2C3E50" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('AboutSettings')}
          >
            <Ionicons name="information-circle-outline" size={24} color="#2C3E50" />
            <Text style={styles.menuText}>About App</Text>
            <Ionicons name="chevron-forward" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('LegalSettings')}
          >
            <Ionicons name="shield-outline" size={24} color="#2C3E50" />
            <Text style={styles.menuText}>Legal</Text>
            <Ionicons name="chevron-forward" size={24} color="#2C3E50" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.copyright}>© 2024 AI Food Tracking</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 15,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  version: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  copyright: {
    fontSize: 12,
    color: '#95A5A6',
  },
});

export default SettingsHomeScreen; 