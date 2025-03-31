import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type ServingUnit = 'g' | 'ml' | 'oz';

interface ServingUnitSelectorProps {
  selectedUnit: ServingUnit;
  onUnitChange: (unit: ServingUnit) => void;
}

const ServingUnitSelector: React.FC<ServingUnitSelectorProps> = ({
  selectedUnit,
  onUnitChange,
}) => {
  const units: ServingUnit[] = ['g', 'ml', 'oz'];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Unit</Text>
      <View style={styles.unitButtons}>
        {units.map((unit) => (
          <TouchableOpacity
            key={unit}
            style={[
              styles.unitButton,
              selectedUnit === unit && styles.unitButtonActive,
            ]}
            onPress={() => onUnitChange(unit)}
          >
            <Text
              style={[
                styles.unitButtonText,
                selectedUnit === unit && styles.unitButtonTextActive,
              ]}
            >
              {unit}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 16,
  },
  label: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  unitButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F0',
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: '#2C3E50',
  },
  unitButtonText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  unitButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default ServingUnitSelector; 