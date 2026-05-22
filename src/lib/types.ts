export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  portion: string;
  time: string; // 12-hour display string
  date: string; // YYYY-MM-DD
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface UserProfile {
  name: string;
  dailyCalorieGoal: number;
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
  age: string;
  weight: string;
  height: string;
}

export interface OnboardingState {
  completed: boolean;
}
