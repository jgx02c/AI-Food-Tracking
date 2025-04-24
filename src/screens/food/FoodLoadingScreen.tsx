import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FoodStackParamList } from '../../navigation/FoodStack';
import { ImageRecognitionService } from '../../services/imageRecognition';

type FoodLoadingScreenNavigationProp = NativeStackNavigationProp<FoodStackParamList>;

const FoodLoadingScreen = () => {
  const navigation = useNavigation<FoodLoadingScreenNavigationProp>();
  const route = useRoute();
  const { imageUri } = route.params as { imageUri: string };

  useEffect(() => {
    const processFoodImage = async () => {
      try {
        // Process the image with PicList
        const prediction = await ImageRecognitionService.recognizeFood(imageUri);
        
        // Navigate to review screen with the prediction
        navigation.replace('FoodReview', { prediction });
      } catch (error) {
        console.error('Error processing food image:', error);
        // If there's an error, go back to camera
        navigation.goBack();
      }
    };

    processFoodImage();
  }, [imageUri, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#1E4D6B" style={styles.spinner} />
        <Text style={styles.text}>Analyzing your food...</Text>
        <Text style={styles.subText}>This may take a few seconds</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  spinner: {
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
});

export default FoodLoadingScreen; 