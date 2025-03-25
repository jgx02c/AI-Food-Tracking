import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
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
      // Analyze the image
      const foodData = await analyzeFoodImage(`data:image/jpeg;base64,${capturedImage.base64}`);

      // Save to Firebase
      await addFoodEntry({
        timestamp: Date.now(),
        imageUrl: capturedImage.uri,
        description: foodInfo.description || foodData.description,
        calories: foodData.calories,
        nutrients: foodData.nutrients,
        servingSize: foodInfo.servingSize,
        mealType: foodInfo.mealType,
      });

      // Navigate back with success message
      navigation.navigate('Home');
      Alert.alert('Success', 'Food entry added successfully!');
    } catch (error) {
      console.error('Error processing food:', error);
      Alert.alert(
        'Error',
        'Failed to process food image. Please try again.'
      );
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
    // Camera permissions are still loading
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>We need your permission to show the camera</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={requestPermission}
        >
          <Text style={styles.retryText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
        <View style={styles.overlay}>
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
        </View>
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
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Serving Size</Text>
              <TextInput
                style={styles.input}
                value={foodInfo.servingSize}
                onChangeText={(text) => setFoodInfo(prev => ({ ...prev, servingSize: text }))}
                placeholder="E.g., 1 bowl, 200g"
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
    marginBottom: 30,
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
    borderColor: '#000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
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
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  mealTypeButtonActive: {
    backgroundColor: '#2196F3',
  },
  mealTypeText: {
    color: '#666',
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
    backgroundColor: '#ff6b6b',
  },
  submitButton: {
    backgroundColor: '#2196F3',
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CameraScreen; 