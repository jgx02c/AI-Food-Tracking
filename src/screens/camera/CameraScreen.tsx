import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { CameraCapturedPicture } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StorageService } from '../../services/storage';
import { ImageRecognitionService } from '../../services/imageRecognition';

type RootStackParamList = {
  Settings: undefined;
  AddFood: { prediction: any };
};

type CameraScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CameraScreen = () => {
  const navigation = useNavigation<CameraScreenNavigationProp>();
  const [permission, requestPermission] = useCameraPermissions();
  const [piclistKey, setPiclistKey] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      const key = await StorageService.getPiclistKey();
      setPiclistKey(key);
    })();
  }, []);

  // ... existing code ...
} 