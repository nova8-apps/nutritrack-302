import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Trash2, ChevronRight } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { colors, radii } from '@/lib/theme';
import { Meal } from '@/lib/types';

interface MealRowProps {
  meal: Meal;
  onPress: () => void;
  onDelete: () => void;
}

const categoryEmoji: Record<string, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
};

export function MealRow({ meal, onPress, onDelete }: MealRowProps) {
  return (
    <Animated.View entering={FadeIn.duration(300).springify()}>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgCard, borderRadius: radii.md, padding: 14, marginBottom: 10 }}>
        <Pressable
          onPress={onPress}
          style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
          accessibilityLabel={`View ${meal.name} details`}
          testID={`meal-row-${meal.id}`}
        >
          <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: colors.accentDim, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
            <Text style={{ fontSize: 18 }}>{categoryEmoji[meal.category] ?? '🍽️'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.textPrimary }} numberOfLines={1}>
              {meal.name}
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
              {meal.time} · {meal.portion}
            </Text>
          </View>
          <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: colors.accent, marginRight: 8 }}>
            {meal.calories}
          </Text>
          <ChevronRight size={16} color={colors.textMuted} />
        </Pressable>
        <Pressable
          onPress={onDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel={`Delete ${meal.name}`}
          testID={`meal-delete-${meal.id}`}
          style={{ marginLeft: 8, padding: 6 }}
        >
          <Trash2 size={16} color={colors.destructive} />
        </Pressable>
      </View>
    </Animated.View>
  );
}
