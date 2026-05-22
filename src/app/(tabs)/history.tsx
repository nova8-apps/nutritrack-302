import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '@/lib/store';
import { colors, radii } from '@/lib/theme';
import { MealRow } from '@/components/MealRow';
import { EmptyState } from '@/components/EmptyState';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const meals = useAppStore((s) => s.meals);
  const removeMeal = useAppStore((s) => s.removeMeal);

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(now.toISOString().slice(0, 10));

  const mealDates = useMemo(() => {
    const set = new Set<string>();
    for (const m of meals) set.add(m.date);
    return set;
  }, [meals]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const todayKey = now.toISOString().slice(0, 10);

  const prevMonth = useCallback(() => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    setViewMonth((m) => {
      if (m === 0) { setViewYear((y) => y - 1); return 11; }
      return m - 1;
    });
  }, []);

  const nextMonth = useCallback(() => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    setViewMonth((m) => {
      if (m === 11) { setViewYear((y) => y + 1); return 0; }
      return m + 1;
    });
  }, []);

  const selectedMeals = useMemo(() => meals.filter((m) => m.date === selectedDate), [meals, selectedDate]);
  const selectedTotal = useMemo(() => selectedMeals.reduce((a, m) => a + m.calories, 0), [selectedMeals]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 120, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Calendar header — large date card */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Pressable onPress={prevMonth} hitSlop={12} accessibilityLabel="Previous month" testID="cal-prev">
              <ChevronLeft size={22} color={colors.textSecondary} />
            </Pressable>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 20, color: colors.textPrimary, marginHorizontal: 16 }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </Text>
            <Pressable onPress={nextMonth} hitSlop={12} accessibilityLabel="Next month" testID="cal-next">
              <ChevronRight size={22} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        {/* Weekday headers */}
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          {WEEKDAYS.map((d) => (
            <View key={d} style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {d}
              </Text>
            </View>
          ))}
        </View>

        {/* Calendar grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 }}>
          {Array.from({ length: firstDay }).map((_, i) => (
            <View key={`empty-${i}`} style={{ width: '14.28%', height: 44 }} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateKey = formatDateKey(viewYear, viewMonth, day);
            const hasMeals = mealDates.has(dateKey);
            const isToday = dateKey === todayKey;
            const isSelected = dateKey === selectedDate;

            return (
              <Pressable
                key={day}
                onPress={() => {
                  if (Platform.OS !== 'web') Haptics.selectionAsync();
                  setSelectedDate(dateKey);
                }}
                style={{
                  width: '14.28%',
                  height: 44,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                accessibilityLabel={`${MONTH_NAMES[viewMonth]} ${day}`}
                testID={`cal-day-${day}`}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isSelected ? colors.accent : isToday ? colors.accentDim : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: isToday || isSelected ? 'Inter_700Bold' : 'Inter_400Regular',
                      fontSize: 14,
                      color: isSelected ? '#fff' : isToday ? colors.accent : colors.textPrimary,
                    }}
                  >
                    {day}
                  </Text>
                  {hasMeals && !isSelected ? (
                    <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: colors.accent, position: 'absolute', bottom: 3 }} />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Selected day summary */}
        {selectedMeals.length > 0 ? (
          <View style={{ backgroundColor: colors.bgCard, borderRadius: radii.md, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Flame size={18} color={colors.accent} />
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textPrimary, marginLeft: 8 }}>
              {selectedTotal} kcal
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary, marginLeft: 6 }}>
              · {selectedMeals.length} meal{selectedMeals.length !== 1 ? 's' : ''}
            </Text>
          </View>
        ) : null}

        {/* Meals for selected day */}
        {selectedMeals.length === 0 ? (
          <EmptyState icon={Flame} title="No meals logged" subtitle="Select a different day or log a new meal" />
        ) : (
          selectedMeals.map((meal) => (
            <MealRow
              key={meal.id}
              meal={meal}
              onPress={() => router.push(`/meal-detail?id=${meal.id}`)}
              onDelete={() => removeMeal(meal.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
