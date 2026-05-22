import { Meal, UserProfile } from './types';

const today = new Date().toISOString().slice(0, 10);
const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);
const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10);
const fourDaysAgo = new Date(Date.now() - 4 * 86400000).toISOString().slice(0, 10);

export const SEED_MEALS: Meal[] = [
  { id: '1', name: 'Oatmeal with Berries', calories: 350, protein: 12, carbs: 58, fat: 8, fiber: 6, sugar: 14, portion: '1 bowl', time: '8:15 AM', date: today, category: 'breakfast' },
  { id: '2', name: 'Chicken Caesar Salad', calories: 520, protein: 38, carbs: 22, fat: 32, fiber: 4, sugar: 3, portion: '1 plate', time: '12:45 PM', date: today, category: 'lunch' },
  { id: '3', name: 'Greek Yogurt', calories: 150, protein: 15, carbs: 12, fat: 4, fiber: 0, sugar: 9, portion: '1 cup', time: '3:30 PM', date: today, category: 'snack' },
  { id: '4', name: 'Scrambled Eggs & Toast', calories: 420, protein: 24, carbs: 30, fat: 22, fiber: 2, sugar: 4, portion: '2 eggs + 1 slice', time: '7:45 AM', date: yesterday, category: 'breakfast' },
  { id: '5', name: 'Turkey Club Sandwich', calories: 580, protein: 34, carbs: 44, fat: 28, fiber: 3, sugar: 6, portion: '1 sandwich', time: '1:00 PM', date: yesterday, category: 'lunch' },
  { id: '6', name: 'Grilled Salmon & Rice', calories: 610, protein: 42, carbs: 48, fat: 18, fiber: 2, sugar: 1, portion: '1 plate', time: '7:15 PM', date: yesterday, category: 'dinner' },
  { id: '7', name: 'Banana Protein Shake', calories: 280, protein: 28, carbs: 36, fat: 4, fiber: 3, sugar: 22, portion: '1 shake', time: '9:00 AM', date: twoDaysAgo, category: 'breakfast' },
  { id: '8', name: 'Veggie Stir Fry', calories: 380, protein: 14, carbs: 46, fat: 16, fiber: 8, sugar: 10, portion: '1 bowl', time: '12:30 PM', date: twoDaysAgo, category: 'lunch' },
  { id: '9', name: 'Avocado Toast', calories: 310, protein: 8, carbs: 28, fat: 20, fiber: 7, sugar: 2, portion: '2 slices', time: '8:30 AM', date: threeDaysAgo, category: 'breakfast' },
  { id: '10', name: 'Pasta Bolognese', calories: 680, protein: 32, carbs: 72, fat: 26, fiber: 5, sugar: 8, portion: '1 plate', time: '7:00 PM', date: threeDaysAgo, category: 'dinner' },
  { id: '11', name: 'Protein Bar', calories: 220, protein: 20, carbs: 24, fat: 8, fiber: 3, sugar: 6, portion: '1 bar', time: '4:00 PM', date: fourDaysAgo, category: 'snack' },
  { id: '12', name: 'Chicken Burrito Bowl', calories: 640, protein: 40, carbs: 62, fat: 22, fiber: 8, sugar: 4, portion: '1 bowl', time: '1:15 PM', date: fourDaysAgo, category: 'lunch' },
];

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Mehdi',
  dailyCalorieGoal: 2000,
  proteinPct: 30,
  carbsPct: 40,
  fatPct: 30,
  age: '',
  weight: '',
  height: '',
};

export const COMMON_FOODS = [
  { name: 'Oatmeal with Berries', calories: 350, protein: 12, carbs: 58, fat: 8, fiber: 6, sugar: 14, portion: '1 bowl' },
  { name: 'Chicken Caesar Salad', calories: 520, protein: 38, carbs: 22, fat: 32, fiber: 4, sugar: 3, portion: '1 plate' },
  { name: 'Greek Yogurt', calories: 150, protein: 15, carbs: 12, fat: 4, fiber: 0, sugar: 9, portion: '1 cup' },
  { name: 'Scrambled Eggs & Toast', calories: 420, protein: 24, carbs: 30, fat: 22, fiber: 2, sugar: 4, portion: '2 eggs + 1 slice' },
  { name: 'Grilled Chicken Breast', calories: 280, protein: 44, carbs: 0, fat: 10, fiber: 0, sugar: 0, portion: '6 oz' },
  { name: 'Brown Rice', calories: 220, protein: 5, carbs: 46, fat: 2, fiber: 3, sugar: 0, portion: '1 cup' },
  { name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0, fiber: 3, sugar: 14, portion: '1 medium' },
  { name: 'Almonds', calories: 170, protein: 6, carbs: 6, fat: 15, fiber: 3, sugar: 1, portion: '1 oz (23 nuts)' },
  { name: 'Salmon Fillet', calories: 360, protein: 36, carbs: 0, fat: 22, fiber: 0, sugar: 0, portion: '6 oz' },
  { name: 'Avocado Toast', calories: 310, protein: 8, carbs: 28, fat: 20, fiber: 7, sugar: 2, portion: '2 slices' },
  { name: 'Turkey Club Sandwich', calories: 580, protein: 34, carbs: 44, fat: 28, fiber: 3, sugar: 6, portion: '1 sandwich' },
  { name: 'Protein Bar', calories: 220, protein: 20, carbs: 24, fat: 8, fiber: 3, sugar: 6, portion: '1 bar' },
  { name: 'Veggie Stir Fry', calories: 380, protein: 14, carbs: 46, fat: 16, fiber: 8, sugar: 10, portion: '1 bowl' },
  { name: 'Pasta Bolognese', calories: 680, protein: 32, carbs: 72, fat: 26, fiber: 5, sugar: 8, portion: '1 plate' },
  { name: 'Apple', calories: 95, protein: 0, carbs: 25, fat: 0, fiber: 4, sugar: 19, portion: '1 medium' },
  { name: 'Protein Shake', calories: 180, protein: 30, carbs: 8, fat: 3, fiber: 1, sugar: 2, portion: '1 scoop + water' },
  { name: 'Hard Boiled Egg', calories: 78, protein: 6, carbs: 1, fat: 5, fiber: 0, sugar: 0, portion: '1 egg' },
  { name: 'Sweet Potato', calories: 112, protein: 2, carbs: 26, fat: 0, fiber: 4, sugar: 5, portion: '1 medium' },
];
