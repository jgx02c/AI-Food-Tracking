import { collection, addDoc, query, where, getDocs, Timestamp, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from './firebase';
import type { FoodEntry } from '../types/food';

export const addFoodEntry = async (entry: Omit<FoodEntry, 'id'>): Promise<string> => {
  try {
    // First, if there's a local image URI, upload it to Firebase Storage
    let imageUrl = entry.imageUrl;
    if (imageUrl.startsWith('file://')) {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const imagePath = `food-images/${Date.now()}.jpg`;
      const storageRef = ref(storage, imagePath);
      await uploadBytes(storageRef, blob);
      imageUrl = await getDownloadURL(storageRef);
    }

    // Add the entry to Firestore
    const userId = auth.currentUser?.uid;
    const docRef = await addDoc(collection(db, 'foodEntries'), {
      ...entry,
      imageUrl,
      userId,
      createdAt: Timestamp.now(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error adding food entry:', error);
    throw error;
  }
};

export const getFoodEntriesForDate = async (dateString: string): Promise<FoodEntry[]> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    // Convert date string to start and end timestamps for the day
    const date = new Date(dateString);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const q = query(
      collection(db, 'foodEntries'),
      where('userId', '==', userId),
      where('timestamp', '>=', startOfDay.getTime()),
      where('timestamp', '<=', endOfDay.getTime()),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FoodEntry));
  } catch (error) {
    console.error('Error getting food entries for date:', error);
    throw error;
  }
};

export const getFoodEntries = async (startDate: Date, endDate: Date): Promise<FoodEntry[]> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    const q = query(
      collection(db, 'foodEntries'),
      where('userId', '==', userId),
      where('timestamp', '>=', startDate.getTime()),
      where('timestamp', '<=', endDate.getTime()),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FoodEntry));
  } catch (error) {
    console.error('Error getting food entries:', error);
    throw error;
  }
}; 