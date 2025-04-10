import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { showActionSheet } from '../../utils/ActionSheet';

interface HeaderProps {
  title: string;
  date: string;
}

const Header = ({ title, date }: HeaderProps) => {
  const navigation = useNavigation();

  const showAddOptions = () => {
    showActionSheet(
      {
        options: ['Cancel', 'Add Weight'],
        cancelButtonIndex: 0,
      },
      (buttonIndex: number) => {
        if (buttonIndex === 1) {
          navigation.navigate('AddWeight');
        }
      }
    );
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={showAddOptions} style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={24} color="#1E4D6B" />
        </TouchableOpacity>
      </View>
      <Text style={styles.date}>{date}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  date: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  addButton: {
    padding: 8,
  },
});

export default Header; 