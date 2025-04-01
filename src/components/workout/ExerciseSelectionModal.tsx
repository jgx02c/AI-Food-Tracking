import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, FlatList, Platform } from 'react-native';
import { Exercise, MuscleGroup } from '../../types/workout';
import { exercises } from '../../data/exercises';
import CustomExerciseForm from './CustomExerciseForm';

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
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);

  // Get unique muscle groups from all exercises
  const muscleGroups = useMemo(() => {
    const groups = new Set<MuscleGroup>();
    exercises.forEach(exercise => {
      exercise.muscleGroups.forEach(group => groups.add(group));
    });
    return Array.from(groups).sort();
  }, []);

  // Filter exercises based on search query and selected muscle group
  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMuscleGroup = !selectedMuscleGroup || 
        exercise.muscleGroups.includes(selectedMuscleGroup);
      return matchesSearch && matchesMuscleGroup;
    });
  }, [searchQuery, selectedMuscleGroup]);

  const handleCustomExerciseSubmit = (exercise: Exercise) => {
    onSelect(exercise);
    setShowCustomForm(false);
    onClose();
  };

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={[
        styles.exerciseItem,
        selectedExerciseIds.includes(item.id) && styles.selectedExercise
      ]}
      onPress={() => {
        onSelect(item);
        onClose();
      }}
    >
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text style={styles.muscleGroups}>
          {item.muscleGroups.join(', ')}
        </Text>
      </View>
      <Text style={styles.difficulty}>{item.difficulty}</Text>
    </TouchableOpacity>
  );

  if (showCustomForm) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={() => setShowCustomForm(false)}
      >
        <CustomExerciseForm
          onSubmit={handleCustomExerciseSubmit}
          onCancel={() => setShowCustomForm(false)}
        />
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Exercise</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.muscleGroupsContainer}>
            <FlatList
              horizontal
              data={['all' as const, ...muscleGroups]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.muscleGroupButton,
                    selectedMuscleGroup === item && styles.selectedMuscleGroup
                  ]}
                  onPress={() => setSelectedMuscleGroup(item === 'all' ? null : item)}
                >
                  <Text style={[
                    styles.muscleGroupText,
                    selectedMuscleGroup === item && styles.selectedMuscleGroupText
                  ]}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <FlatList
            data={filteredExercises}
            renderItem={renderExerciseItem}
            keyExtractor={(item) => item.id}
            style={styles.exerciseList}
          />

          <TouchableOpacity
            style={styles.customExerciseButton}
            onPress={() => setShowCustomForm(true)}
          >
            <Text style={styles.customExerciseButtonText}>Create Custom Exercise</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: Platform.OS === 'ios' ? 50 : 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#1E4D6B',
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  muscleGroupsContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  muscleGroupButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    marginRight: 8,
  },
  selectedMuscleGroup: {
    backgroundColor: '#1E4D6B',
  },
  muscleGroupText: {
    fontSize: 14,
    color: '#2C3E50',
  },
  selectedMuscleGroupText: {
    color: '#FFFFFF',
  },
  exerciseList: {
    flex: 1,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  selectedExercise: {
    backgroundColor: '#F8F9FA',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  muscleGroups: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  difficulty: {
    fontSize: 14,
    color: '#7F8C8D',
    textTransform: 'capitalize',
  },
  customExerciseButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#1E4D6B',
    borderRadius: 8,
    alignItems: 'center',
  },
  customExerciseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ExerciseSelectionModal; 