import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PICLIST_API_KEY_KEY = 'piclist_api_key';

const ProfileScreen = () => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    loadApiKey();
  }, []);

  const loadApiKey = async () => {
    try {
      const key = await AsyncStorage.getItem(PICLIST_API_KEY_KEY);
      if (key) {
        setApiKey(key);
      }
    } catch (error) {
      console.error('Error loading API key:', error);
    }
  };

  const saveApiKey = async () => {
    try {
      await AsyncStorage.setItem(PICLIST_API_KEY_KEY, apiKey);
      Alert.alert('Success', 'API key saved successfully');
    } catch (error) {
      console.error('Error saving API key:', error);
      Alert.alert('Error', 'Failed to save API key');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <View style={styles.apiKeyContainer}>
            <Text style={styles.apiKeyLabel}>PicList API Key</Text>
            <TextInput
              style={styles.apiKeyInput}
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="Enter your PicList API key"
              secureTextEntry
            />
            <TouchableOpacity style={styles.saveButton} onPress={saveApiKey}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={24} color="#2C3E50" />
            <Text style={styles.menuText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="cloud-upload-outline" size={24} color="#2C3E50" />
            <Text style={styles.menuText}>Backup & Restore</Text>
            <Ionicons name="chevron-forward" size={24} color="#2C3E50" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={24} color="#2C3E50" />
            <Text style={styles.menuText}>Help Center</Text>
            <Ionicons name="chevron-forward" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="mail-outline" size={24} color="#2C3E50" />
            <Text style={styles.menuText}>Contact Developer</Text>
            <Ionicons name="chevron-forward" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="information-circle-outline" size={24} color="#2C3E50" />
            <Text style={styles.menuText}>About</Text>
            <Ionicons name="chevron-forward" size={24} color="#2C3E50" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="shield-outline" size={24} color="#2C3E50" />
            <Text style={styles.menuText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="document-text-outline" size={24} color="#2C3E50" />
            <Text style={styles.menuText}>Terms of Service</Text>
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
  apiKeyContainer: {
    marginBottom: 20,
  },
  apiKeyLabel: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 8,
  },
  apiKeyInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: '#1E4D6B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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

export default ProfileScreen; 