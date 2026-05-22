import React, { useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, UtensilsCrossed } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useAppStore } from '@/lib/store';
import { colors, radii } from '@/lib/theme';
import { ProgressRing } from '@/components/ProgressRing';
import { MacroBar } from '@/components/MacroBar';
import { MealRow } from '@/components/MealRow';
import { EmptyState } from '@/components/EmptyState';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const meals = useAppStore((s) => s.meals);
  const profile = useAppStore((s) => s.profile);
  const removeMeal = useAppStore((s) => s.removeMeal);

  const today = new Date().toISOString().slice(0, 10);
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';
  const dateStr = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`;

  const todayMeals = useMemo(() => meals.filter((m) => m.date === today), [meals, today]);

  const totals = useMemo(() => {
    let cal = 0, p = 0, c = 0, f = 0;
    for (const m of todayMeals) { cal += m.calories; p += m.protein; c += m.carbs; f += m.fat; }
    return { calories: cal, protein: p, carbs: c, fat: f };
  }, [todayMeals]);

  const macroGoals = useMemo(() => {
    const totalCal = profile.dailyCalorieGoal;
    return {
      protein: Math.round((totalCal * profile.proteinPct / 100) / 4),
      carbs: Math.round((totalCal * profile.carbsPct / 100) / 4),
      fat: Math.round((totalCal * profile.fatPct / 100) / 9),
    };
  }, [profile]);

  const btnScale = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));

  const handleLogPress = useCallback(() => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    btnScale.value = withSpring(0.95, { damping: 15 });
    setTimeout(() => {
      btnScale.value = withSpring(1, { damping: 15 });
      router.push('/log-meal');
    }, 80);
  }, [router, btnScale]);

  const handleDelete = useCallback((id: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    removeMeal(id);
  }, [removeMeal]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 120, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header — personalized greeting */}
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary }}>
          {greeting}, {profile.name}
        </Text>
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: colors.textMuted, marginTop: 2 }}>
          {dateStr}
        </Text>

        {/* Progress Ring */}
        <View style={{ alignItems: 'center', marginTop: 28, marginBottom: 24 }}>
          <ProgressRing consumed={totals.calories} goal={profile.dailyCalorieGoal} size={220} strokeWidth={16} />
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textMuted, marginTop: 8 }}>
            {totals.calories} / {profile.dailyCalorieGoal} kcal consumed
          </Text>
        </View>

        {/* Macro Bars */}
        <View style={{ backgroundColor: colors.bgCard, borderRadius: radii.lg, padding: 18, marginBottom: 24 }}>
          <MacroBar label="Protein" current={totals.protein} goal={macroGoals.protein} color="#22C55E" />
          <MacroBar label="Carbs" current={totals.carbs} goal={macroGoals.carbs} color="#3B82F6" />
          <MacroBar label="Fat" current={totals.fat} goal={macroGoals.fat} color="#F59E0B" />
        </View>

        {/* Log Meal Button */}
        <Animated.View style={btnStyle}>
          <Pressable
            onPress={handleLogPress}
            style={{
              backgroundColor: colors.accent,
              borderRadius: radii.xl,
              height: 56,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
            }}
            accessibilityLabel="Log a meal"
            testID="log-meal-button" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Plus size={22} color="#fff" />
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 17, color: '#fff', marginLeft: 8 }}>
              Log Meal
            </Text>
          </Pressable>
        </Animated.View>

        {/* Today's Meals */}
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 17, color: colors.textPrimary, marginBottom: 14 }}>
          Today's Meals
        </Text>
        {todayMeals.length === 0 ? (
          <EmptyState
            icon={UtensilsCrossed}
            title="No meals logged yet"
            subtitle="Tap the button to get started"
          />
        ) : (
          todayMeals.map((meal) => (
            <MealRow
              key={meal.id}
              meal={meal}
              onPress={() => router.push(`/meal-detail?id=${meal.id}`)}
              onDelete={() => handleDelete(meal.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
