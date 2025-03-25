import config from '../config';
import type { Nutrients } from '../types/food';

interface FoodAnalysisResponse {
  description: string;
  calories: number;
  nutrients: {
    protein_g: number;
    carbohydrates_g: number;
    fat_g: number;
    fiber_g: number;
  };
  confidence: number;
}

interface FoodRecognitionResult {
  description: string;
  calories: number;
  nutrients: Nutrients;
}

export const analyzeFoodImage = async (base64Image: string): Promise<FoodRecognitionResult> => {
  try {
    const response = await fetch(config.foodAi.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.foodAi.apiKey}`,
      },
      body: JSON.stringify({
        image: base64Image,
        analyze_nutrients: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Food recognition failed: ${response.statusText}`);
    }

    const data: FoodAnalysisResponse = await response.json();

    return {
      description: data.description,
      calories: data.calories,
      nutrients: {
        protein: data.nutrients.protein_g,
        carbs: data.nutrients.carbohydrates_g,
        fat: data.nutrients.fat_g,
        fiber: data.nutrients.fiber_g,
      },
    };
  } catch (error) {
    console.error('Error analyzing food image:', error);
    throw error;
  }
}; 