import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HeaderProps {
  title: string;
  date: string;
}

const Header = ({ title, date }: HeaderProps) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.date}>{date}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#7F8C8D',
  },
});

export default Header; 