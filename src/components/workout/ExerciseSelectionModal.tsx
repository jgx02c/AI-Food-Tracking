import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, FlatList, Platform } from 'react-native';
import { Exercise } from '../../types/workout';
import { exercises } from '../../data/exercises';

interface ExerciseSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
  selectedExerciseIds: string[];
}

const ExerciseSelectionModal: React.FC<ExerciseSelectionModalProps> = ({
  visible,
  onClose,
  onSelect,
  selectedExerciseIds,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExercises = exercises.filter(
    (exercise) =>
      !selectedExerciseIds.includes(exercise.id) &&
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Exercise</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <FlatList
            data={filteredExercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.exerciseItem}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={styles.exerciseName}>{item.name}</Text>
                <Text style={styles.exerciseDetails}>
                  {item.muscleGroups.join(', ')}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No exercises found</Text>
            }
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3D4F',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    color: '#A67356',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  searchInput: {
    backgroundColor: '#F5F7FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    color: '#2C3D4F',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  exerciseItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7FA',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3D4F',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#829AAF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#829AAF',
    marginTop: 32,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});

export default ExerciseSelectionModal; 