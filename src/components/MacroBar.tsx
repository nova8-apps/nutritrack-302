import React from 'react';
import { View, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { colors } from '@/lib/theme';

interface MacroBarProps {
  label: string;
  current: number;
  goal: number;
  color: string;
  unit?: string;
}

export function MacroBar({ label, current, goal, color, unit = 'g' }: MacroBarProps) {
  const pct = Math.min(current / Math.max(goal, 1), 1);
  const width = useSharedValue(0);

  React.useEffect(() => {
    width.value = withTiming(pct, { duration: 500, easing: Easing.out(Easing.cubic) });
  }, [pct]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%` as any,
    height: '100%',
    borderRadius: 6,
    backgroundColor: color,
  }));

  return (
    <View style={{ marginBottom: 14 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: colors.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase' }}>
          {label}
        </Text>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary }}>
          {current}{unit} / {goal}{unit}
        </Text>
      </View>
      <View style={{ height: 8, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.06)' }}>
        <Animated.View style={barStyle} />
      </View>
    </View>
  );
}
