import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../services/storage';

interface OnboardingData {
  currentWeight: string;
  targetWeight: string;
  goal: 'lose' | 'gain' | 'maintain';
  piclistKey: string;
}

const OnboardingScreen = ({ navigation }: any) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    currentWeight: '',
    targetWeight: '',
    goal: 'maintain',
    piclistKey: '',
  });

  const handleNext = async () => {
    if (step === 3) {
      // Save all data
      await StorageService.savePiclistKey(data.piclistKey);
      await StorageService.saveUserGoals({
        weight: data.currentWeight,
        targetWeight: data.targetWeight,
        calorieGoal: '2000', // Default, can be adjusted in settings
        proteinGoal: '150',
        carbsGoal: '200',
        fatGoal: '65',
      });
      navigation.replace('MainTabs');
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Welcome to AI Food Tracking</Text>
            <Text style={styles.subtitle}>Let's set up your goals</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Weight (kg)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={data.currentWeight}
                onChangeText={(value) => setData({ ...data, currentWeight: value })}
                placeholder="Enter your current weight"
                placeholderTextColor="#829AAF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Target Weight (kg)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={data.targetWeight}
                onChangeText={(value) => setData({ ...data, targetWeight: value })}
                placeholder="Enter your target weight"
                placeholderTextColor="#829AAF"
              />
            </View>

            <View style={styles.goalButtons}>
              <TouchableOpacity
                style={[
                  styles.goalButton,
                  data.goal === 'lose' && styles.selectedGoal,
                ]}
                onPress={() => setData({ ...data, goal: 'lose' })}
              >
                <Text style={[
                  styles.goalButtonText,
                  data.goal === 'lose' && styles.selectedGoalText,
                ]}>Lose Weight</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.goalButton,
                  data.goal === 'maintain' && styles.selectedGoal,
                ]}
                onPress={() => setData({ ...data, goal: 'maintain' })}
              >
                <Text style={[
                  styles.goalButtonText,
                  data.goal === 'maintain' && styles.selectedGoalText,
                ]}>Maintain</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.goalButton,
                  data.goal === 'gain' && styles.selectedGoal,
                ]}
                onPress={() => setData({ ...data, goal: 'gain' })}
              >
                <Text style={[
                  styles.goalButtonText,
                  data.goal === 'gain' && styles.selectedGoalText,
                ]}>Gain Weight</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Image Recognition Setup</Text>
            <Text style={styles.subtitle}>Add your Piclist Handoff API key to enable food recognition</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Piclist Handoff API Key</Text>
              <TextInput
                style={styles.input}
                value={data.piclistKey}
                onChangeText={(value) => setData({ ...data, piclistKey: value })}
                placeholder="Enter your API key"
                placeholderTextColor="#829AAF"
                secureTextEntry
              />
              <Text style={styles.helperText}>
                Get your API key from Piclist Handoff
              </Text>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>You're All Set!</Text>
            <Text style={styles.subtitle}>Let's start tracking your fitness journey</Text>
            
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>
                Current Weight: {data.currentWeight} kg
              </Text>
              <Text style={styles.summaryText}>
                Target Weight: {data.targetWeight} kg
              </Text>
              <Text style={styles.summaryText}>
                Goal: {data.goal.charAt(0).toUpperCase() + data.goal.slice(1)} Weight
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F0" />
      <View style={styles.container}>
        <View style={styles.progressBar}>
          <View style={[styles.progressStep, step >= 1 && styles.progressStepActive]} />
          <View style={[styles.progressStep, step >= 2 && styles.progressStepActive]} />
          <View style={[styles.progressStep, step >= 3 && styles.progressStepActive]} />
        </View>

        <ScrollView style={styles.content}>
          {renderStep()}
        </ScrollView>

        <View style={styles.footer}>
          {step > 1 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            disabled={step === 1 && (!data.currentWeight || !data.targetWeight)}
          >
            <Text style={styles.nextButtonText}>
              {step === 3 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  progressStep: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  progressStepActive: {
    backgroundColor: '#1E4D6B',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  stepContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3D4F',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#829AAF',
    marginBottom: 32,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    marginBottom: 8,
    color: '#829AAF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    color: '#2C3D4F',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  helperText: {
    fontSize: 12,
    color: '#829AAF',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  goalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  goalButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedGoal: {
    backgroundColor: '#1E4D6B',
    borderColor: '#1E4D6B',
  },
  goalButtonText: {
    fontSize: 16,
    color: '#2C3D4F',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  selectedGoalText: {
    color: '#fff',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    marginTop: 24,
  },
  summaryText: {
    fontSize: 16,
    color: '#2C3D4F',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  backButton: {
    padding: 16,
  },
  backButtonText: {
    color: '#829AAF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  nextButton: {
    backgroundColor: '#1E4D6B',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    opacity: 1,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});

export default OnboardingScreen; 