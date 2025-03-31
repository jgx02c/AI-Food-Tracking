import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const BackButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={() => navigation.goBack()}
    >
      <Ionicons name="chevron-back" size={24} color="#2C3E50" />
      <Text style={styles.text}>Back</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 4,
    color: '#2C3E50',
    fontSize: 16,
  },
});

export default BackButton; 