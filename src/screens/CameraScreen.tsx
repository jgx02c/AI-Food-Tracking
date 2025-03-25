import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { CameraCapturedPicture } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { analyzeFoodImage } from '../services/foodRecognition';
import { addFoodEntry } from '../services/foodEntries';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import type { MealType } from '../types/food';

type CameraScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Camera'>;

interface FoodInfo {
  description: string;
  servingSize: string;
  mealType: MealType;
}

const CameraScreen = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState<CameraCapturedPicture | null>(null);
  const [foodInfo, setFoodInfo] = useState<FoodInfo>({
    description: '',
    servingSize: '',
    mealType: 'snack'
  });
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation<CameraScreenNavigationProp>();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const takePicture = async () => {
    if (isProcessing || !cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.7,
      });
      
      if (photo) {
        setCapturedImage(photo);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    }
  };

  const processImage = async () => {
    if (!capturedImage || isProcessing) return;

    try {
      setIsProcessing(true);
      const foodData = await analyzeFoodImage(`data:image/jpeg;base64,${capturedImage.base64}`);

      await addFoodEntry({
        timestamp: Date.now(),
        imageUrl: capturedImage.uri,
        description: foodInfo.description || foodData.description,
        calories: foodData.calories,
        nutrients: foodData.nutrients,
        servingSize: foodInfo.servingSize,
        mealType: foodInfo.mealType,
      });

      navigation.navigate('Home');
      Alert.alert('Success', 'Food entry added successfully!');
    } catch (error) {
      console.error('Error processing food:', error);
      Alert.alert('Error', 'Failed to process food image. Please try again.');
    } finally {
      setIsProcessing(false);
      setShowModal(false);
      setCapturedImage(null);
      setFoodInfo({
        description: '',
        servingSize: '',
        mealType: 'snack'
      });
    }
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.centered}>
        <StatusBar barStyle="dark-content" backgroundColor="#F1FAEE" />
        <ActivityIndicator size="large" color="#E63946" />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.centered}>
        <StatusBar barStyle="dark-content" backgroundColor="#F1FAEE" />
        <Text style={styles.errorText}>Camera access required</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={requestPermission}
        >
          <Text style={styles.retryText}>Grant Access</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        onMountError={(error) => {
          console.error('Camera mount error:', error);
          Alert.alert('Error', 'Failed to start camera');
        }}
        onCameraReady={() => {
          console.log('Camera is ready');
        }}
      >
        <SafeAreaView style={styles.overlay} edges={['bottom']}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, isProcessing && styles.buttonDisabled]}
              onPress={takePicture}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <View style={styles.captureButton} />
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </CameraView>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Food Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.input}
                value={foodInfo.description}
                onChangeText={(text) => setFoodInfo(prev => ({ ...prev, description: text }))}
                placeholder="E.g., Grilled Chicken Salad"
                placeholderTextColor="#A8A8A8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Serving Size</Text>
              <TextInput
                style={styles.input}
                value={foodInfo.servingSize}
                onChangeText={(text) => setFoodInfo(prev => ({ ...prev, servingSize: text }))}
                placeholder="E.g., 1 bowl, 200g"
                placeholderTextColor="#A8A8A8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Meal Type</Text>
              <View style={styles.mealTypeContainer}>
                {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.mealTypeButton,
                      foodInfo.mealType === type && styles.mealTypeButtonActive
                    ]}
                    onPress={() => setFoodInfo(prev => ({ ...prev, mealType: type }))}
                  >
                    <Text style={[
                      styles.mealTypeText,
                      foodInfo.mealType === type && styles.mealTypeTextActive
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowModal(false);
                  setCapturedImage(null);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={processImage}
                disabled={isProcessing}
              >
                <Text style={styles.modalButtonText}>
                  {isProcessing ? 'Processing...' : 'Submit'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'ios' ? 10 : 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  captureButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#E63946',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1FAEE',
  },
  errorText: {
    fontSize: 18,
    color: '#1D3557',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  retryButton: {
    backgroundColor: '#E63946',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#F1FAEE',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1D3557',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#1D3557',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#A8A8A8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1D3557',
    backgroundColor: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  mealTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  mealTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#A8A8A8',
  },
  mealTypeButtonActive: {
    backgroundColor: '#E63946',
    borderColor: '#E63946',
  },
  mealTypeText: {
    color: '#1D3557',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '500',
  },
  mealTypeTextActive: {
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#1D3557',
  },
  submitButton: {
    backgroundColor: '#E63946',
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});

export default CameraScreen; 