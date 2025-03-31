import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import BackButton from '../../components/BackButton';

const NotificationsSettingsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Notifications</Text>
      </View>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.description}>
            Notification settings coming soon.
          </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginRight: 40,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  description: {
    fontSize: 16,
    color: '#7F8C8D',
    lineHeight: 24,
  },
});

export default NotificationsSettingsScreen; 