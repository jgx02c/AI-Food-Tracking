import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Exercise, MuscleGroup, Equipment } from '../../types/workout';

interface CustomExerciseFormProps {
  onSubmit: (exercise: Exercise) => void;
  onCancel: () => void;
}

const CustomExerciseForm: React.FC<CustomExerciseFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [tips, setTips] = useState<string[]>(['']);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<MuscleGroup[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');

  const muscleGroupOptions: MuscleGroup[] = [
    'chest',
    'back',
    'shoulders',
    'biceps',
    'triceps',
    'legs',
    'core',
    'full-body',
    'cardio'
  ];

  const equipmentOptions: Equipment[] = [
    'bodyweight',
    'barbell',
    'dumbbell',
    'kettlebell',
    'machine',
    'cable',
    'resistanceBand',
    'other'
  ];

  const handleAddInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const handleAddTip = () => {
    setTips([...tips, '']);
  };

  const handleUpdateInstruction = (index: number, value: string) => {
    const updatedInstructions = [...instructions];
    updatedInstructions[index] = value;
    setInstructions(updatedInstructions);
  };

  const handleUpdateTip = (index: number, value: string) => {
    const updatedTips = [...tips];
    updatedTips[index] = value;
    setTips(updatedTips);
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleRemoveTip = (index: number) => {
    setTips(tips.filter((_, i) => i !== index));
  };

  const toggleMuscleGroup = (group: MuscleGroup) => {
    setSelectedMuscleGroups(prev =>
      prev.includes(group)
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  const toggleEquipment = (item: Equipment) => {
    setSelectedEquipment(prev =>
      prev.includes(item)
        ? prev.filter(e => e !== item)
        : [...prev, item]
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('Please enter an exercise name');
      return;
    }

    if (selectedMuscleGroups.length === 0) {
      alert('Please select at least one muscle group');
      return;
    }

    if (selectedEquipment.length === 0) {
      alert('Please select at least one piece of equipment');
      return;
    }

    const exercise: Exercise = {
      id: Date.now().toString(),
      name: name.trim(),
      muscleGroups: selectedMuscleGroups,
      equipment: selectedEquipment,
      description: description.trim(),
      instructions: instructions.filter(i => i.trim()),
      tips: tips.filter(t => t.trim()),
      difficulty,
    };

    onSubmit(exercise);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Exercise Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter exercise name"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter exercise description"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Muscle Groups</Text>
        <View style={styles.optionsContainer}>
          {muscleGroupOptions.map((group) => (
            <TouchableOpacity
              key={group}
              style={[
                styles.optionButton,
                selectedMuscleGroups.includes(group) && styles.selectedOption
              ]}
              onPress={() => toggleMuscleGroup(group)}
            >
              <Text style={[
                styles.optionText,
                selectedMuscleGroups.includes(group) && styles.selectedOptionText
              ]}>
                {group.charAt(0).toUpperCase() + group.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Equipment</Text>
        <View style={styles.optionsContainer}>
          {equipmentOptions.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.optionButton,
                selectedEquipment.includes(item) && styles.selectedOption
              ]}
              onPress={() => toggleEquipment(item)}
            >
              <Text style={[
                styles.optionText,
                selectedEquipment.includes(item) && styles.selectedOptionText
              ]}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Difficulty</Text>
        <View style={styles.difficultyContainer}>
          {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.difficultyButton,
                difficulty === level && styles.selectedDifficulty
              ]}
              onPress={() => setDifficulty(level)}
            >
              <Text style={[
                styles.difficultyText,
                difficulty === level && styles.selectedDifficultyText
              ]}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Instructions</Text>
        {instructions.map((instruction, index) => (
          <View key={index} style={styles.instructionContainer}>
            <TextInput
              style={[styles.input, styles.instructionInput]}
              value={instruction}
              onChangeText={(value) => handleUpdateInstruction(index, value)}
              placeholder={`Step ${index + 1}`}
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveInstruction(index)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddInstruction}
        >
          <Text style={styles.addButtonText}>Add Step</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Tips</Text>
        {tips.map((tip, index) => (
          <View key={index} style={styles.instructionContainer}>
            <TextInput
              style={[styles.input, styles.instructionInput]}
              value={tip}
              onChangeText={(value) => handleUpdateTip(index, value)}
              placeholder={`Tip ${index + 1}`}
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveTip(index)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddTip}
        >
          <Text style={styles.addButtonText}>Add Tip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Create Exercise</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedOption: {
    backgroundColor: '#1E4D6B',
    borderColor: '#1E4D6B',
  },
  optionText: {
    fontSize: 14,
    color: '#2C3E50',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  selectedDifficulty: {
    backgroundColor: '#1E4D6B',
    borderColor: '#1E4D6B',
  },
  difficultyText: {
    fontSize: 14,
    color: '#2C3E50',
  },
  selectedDifficultyText: {
    color: '#FFFFFF',
  },
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  instructionInput: {
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    color: '#E74C3C',
    fontSize: 14,
  },
  addButton: {
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#1E4D6B',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 32,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  submitButton: {
    backgroundColor: '#1E4D6B',
  },
  cancelButtonText: {
    color: '#2C3E50',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomExerciseForm; 