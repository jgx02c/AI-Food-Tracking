import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GoalFormProps, GoalFormData, GoalType } from '../../types/goals';

const GoalForm = ({ onSubmit, initialData, isEditing = false }: GoalFormProps) => {
  const [formData, setFormData] = useState<GoalFormData>({
    title: '',
    type: 'weight',
    target: '',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    unit: '',
    frequency: 'daily',
    category: 'maintenance',
    ...initialData,
  });

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  // Update unit based on goal type
  useEffect(() => {
    switch (formData.type) {
      case 'weight':
        setFormData(prev => ({ ...prev, unit: 'kg' }));
        break;
      case 'bulk':
      case 'cut':
        setFormData(prev => ({ ...prev, unit: 'kg' }));
        break;
      case 'food':
        setFormData(prev => ({ ...prev, unit: 'calories' }));
        break;
      case 'workout':
        setFormData(prev => ({ ...prev, unit: 'sessions' }));
        break;
    }
  }, [formData.type]);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, startDate: selectedDate.toISOString() }));
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, endDate: selectedDate.toISOString() }));
    }
  };

  const renderPickerModal = (
    visible: boolean,
    onClose: () => void,
    title: string,
    options: { label: string; value: string }[],
    selectedValue: string,
    onSelect: (value: string) => void
  ) => (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.modalOption,
                selectedValue === option.value && styles.modalOptionSelected
              ]}
              onPress={() => {
                onSelect(option.value);
                onClose();
              }}
            >
              <Text style={[
                styles.modalOptionText,
                selectedValue === option.value && styles.modalOptionTextSelected
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={formData.title}
          onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
          placeholder="Enter goal title"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Type</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowTypePicker(true)}
        >
          <Text style={styles.pickerButtonText}>
            {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Target</Text>
        <TextInput
          style={styles.input}
          value={formData.target}
          onChangeText={(text) => setFormData(prev => ({ ...prev, target: text }))}
          placeholder="Enter target value"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Unit</Text>
        <Text style={styles.unitText}>{formData.unit}</Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Start Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowStartDatePicker(true)}
        >
          <Text>{new Date(formData.startDate).toLocaleDateString()}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>End Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowEndDatePicker(true)}
        >
          <Text>{new Date(formData.endDate).toLocaleDateString()}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Frequency</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowFrequencyPicker(true)}
        >
          <Text style={styles.pickerButtonText}>
            {formData.frequency.charAt(0).toUpperCase() + formData.frequency.slice(1)}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Category</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowCategoryPicker(true)}
        >
          <Text style={styles.pickerButtonText}>
            {formData.category.charAt(0).toUpperCase() + formData.category.slice(1)}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {isEditing ? 'Update Goal' : 'Create Goal'}
        </Text>
      </TouchableOpacity>

      {showStartDatePicker && (
        <DateTimePicker
          value={new Date(formData.startDate)}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={new Date(formData.endDate)}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}

      {renderPickerModal(
        showTypePicker,
        () => setShowTypePicker(false),
        'Select Type',
        [
          { label: 'Weight', value: 'weight' },
          { label: 'Bulk', value: 'bulk' },
          { label: 'Cut', value: 'cut' },
          { label: 'Food', value: 'food' },
          { label: 'Workout', value: 'workout' }
        ],
        formData.type,
        (value) => setFormData(prev => ({ ...prev, type: value as GoalType }))
      )}

      {renderPickerModal(
        showFrequencyPicker,
        () => setShowFrequencyPicker(false),
        'Select Frequency',
        [
          { label: 'Daily', value: 'daily' },
          { label: 'Weekly', value: 'weekly' },
          { label: 'Monthly', value: 'monthly' }
        ],
        formData.frequency,
        (value) => setFormData(prev => ({ ...prev, frequency: value as GoalFormData['frequency'] }))
      )}

      {renderPickerModal(
        showCategoryPicker,
        () => setShowCategoryPicker(false),
        'Select Category',
        [
          { label: 'Maintenance', value: 'maintenance' },
          { label: 'Improvement', value: 'improvement' }
        ],
        formData.category,
        (value) => setFormData(prev => ({ ...prev, category: value as GoalFormData['category'] }))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
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
  pickerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  unitText: {
    fontSize: 16,
    color: '#7F8C8D',
    padding: 12,
  },
  dateButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  submitButton: {
    backgroundColor: '#1E4D6B',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  modalOptionSelected: {
    backgroundColor: '#F8F9FA',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  modalOptionTextSelected: {
    color: '#1E4D6B',
    fontWeight: '600',
  },
});

export default GoalForm;