import { StorageService, FoodEntry } from './storage';

export class FoodEntriesService {
  static async addFoodEntry(entry: Omit<FoodEntry, 'id'>): Promise<FoodEntry> {
    try {
      const entries = await StorageService.getFoodEntries();
      const newEntry: FoodEntry = {
        ...entry,
        id: Date.now().toString(),
      };
      
      await StorageService.addFoodEntry(newEntry);
      return newEntry;
    } catch (error) {
      console.error('Error adding food entry:', error);
      throw error;
    }
  }

  static async getFoodEntries(): Promise<FoodEntry[]> {
    try {
      return await StorageService.getFoodEntries();
    } catch (error) {
      console.error('Error getting food entries:', error);
      throw error;
    }
  }

  static async deleteFoodEntry(id: string): Promise<void> {
    try {
      await StorageService.deleteFoodEntry(id);
    } catch (error) {
      console.error('Error deleting food entry:', error);
      throw error;
    }
  }
} 