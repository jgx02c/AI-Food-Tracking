import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { format, subDays } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';

interface DateSelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const DateSelector = ({ selectedDate, onDateSelect }: DateSelectorProps) => {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const toggleCalendar = () => {
    setIsCalendarVisible(!isCalendarVisible);
  };

  const handleDateSelect = (date: Date) => {
    onDateSelect(date);
    setIsCalendarVisible(false);
  };

  const markedDates = {
    [format(selectedDate, 'yyyy-MM-dd')]: {
      selected: true,
      selectedColor: '#4A90E2',
    },
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.selector} onPress={toggleCalendar}>
        <Text style={styles.selectedDate}>
          {format(selectedDate, 'MMM dd, yyyy')}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isCalendarVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleCalendar}
      >
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Select Date</Text>
              <TouchableOpacity onPress={toggleCalendar} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#2C3D4F" />
              </TouchableOpacity>
            </View>
            <Calendar
              current={format(selectedDate, 'yyyy-MM-dd')}
              markedDates={markedDates}
              onDayPress={(day: DateData) => handleDateSelect(new Date(day.dateString))}
              minDate={format(subDays(new Date(), 7), 'yyyy-MM-dd')}
              maxDate={format(new Date(), 'yyyy-MM-dd')}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  selector: {
    backgroundColor: '#F5F5F0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3D4F',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3D4F',
  },
  closeButton: {
    padding: 8,
  },
});

export default DateSelector; 