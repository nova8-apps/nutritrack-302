import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Meal, UserProfile } from './types';
import { SEED_MEALS, DEFAULT_PROFILE } from './demo-data';

interface AppState {
  meals: Meal[];
  profile: UserProfile;
  onboardingCompleted: boolean;
  isPro: boolean;
  isCheckingEntitlement: boolean;

  addMeal: (meal: Meal) => void;
  removeMeal: (id: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  completeOnboarding: () => void;
  setIsPro: (val: boolean) => void;
  setIsCheckingEntitlement: (val: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      meals: SEED_MEALS,
      profile: DEFAULT_PROFILE,
      onboardingCompleted: false,
      isPro: false,
      isCheckingEntitlement: false,

      addMeal: (meal) =>
        set((s) => ({ meals: [meal, ...s.meals] })),

      removeMeal: (id) =>
        set((s) => ({ meals: s.meals.filter((m) => m.id !== id) })),

      updateProfile: (partial) =>
        set((s) => ({ profile: { ...s.profile, ...partial } })),

      completeOnboarding: () => set({ onboardingCompleted: true }),

      setIsPro: (val) => set({ isPro: val }),

      setIsCheckingEntitlement: (val) => set({ isCheckingEntitlement: val }),
    }),
    {
      name: 'calorie-tracker-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
