import { StorageService } from './storage';

interface FoodPrediction {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
}

export class ImageRecognitionService {
  private static API_URL = 'https://api.piclist.ai/v1/food/recognize';

  static async recognizeFood(base64Image: string): Promise<FoodPrediction> {
    try {
      const piclistKey = await StorageService.getPiclistKey();
      
      if (!piclistKey) {
        throw new Error('Piclist API key not found. Please add your key in Settings.');
      }

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Handoff-Key': piclistKey,
        },
        body: JSON.stringify({
          image: base64Image,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid Piclist API key. Please check your key in Settings.');
        }
        throw new Error('Failed to recognize food');
      }

      const data = await response.json();
      return {
        name: data.name,
        calories: data.nutrition.calories,
        protein: data.nutrition.protein,
        carbs: data.nutrition.carbohydrates,
        fat: data.nutrition.fat,
        confidence: data.confidence,
      };
    } catch (error) {
      console.error('Error recognizing food:', error);
      throw error;
    }
  }
} 