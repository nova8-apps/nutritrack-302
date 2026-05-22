import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User, Target, Scale, Ruler, Cake, Crown, ChevronRight, LogOut } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '@/lib/store';
import { colors, radii } from '@/lib/theme';

function SliderRow({ label, value, onChange, min, max, suffix }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; suffix: string }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <View style={{ marginBottom: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.textSecondary }}>{label}</Text>
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 14, color: colors.accent }}>{value}{suffix}</Text>
      </View>
      <View style={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.06)' }}>
        <View style={{ width: `${pct}%` as any, height: 6, borderRadius: 3, backgroundColor: colors.accent }} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
        <Pressable
          onPress={() => { if (value > min) onChange(value - 5); }}
          hitSlop={10}
          accessibilityLabel={`Decrease ${label}`}
          style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: colors.bgCardNested, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: colors.textPrimary, fontSize: 18, fontFamily: 'Inter_700Bold' }}>−</Text>
        </Pressable>
        <Pressable
          onPress={() => { if (value < max) onChange(value + 5); }}
          hitSlop={10}
          accessibilityLabel={`Increase ${label}`}
          style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: colors.bgCardNested, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: colors.textPrimary, fontSize: 18, fontFamily: 'Inter_700Bold' }}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function SettingRow({ icon: Icon, label, value, onPress }: { icon: any; label: string; value?: string; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border }}
      accessibilityLabel={label}
      testID={`setting-${label.toLowerCase().replace(/\s/g, '-')}`}
    >
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.accentDim, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
        <Icon size={18} color={colors.accent} />
      </View>
      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: colors.textPrimary, flex: 1 }}>{label}</Text>
      {value ? (
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, marginRight: 8 }}>{value}</Text>
      ) : null}
      {onPress ? <ChevronRight size={16} color={colors.textMuted} /> : null}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const profile = useAppStore((s) => s.profile);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const isPro = useAppStore((s) => s.isPro);

  const [name, setName] = useState(profile.name);
  const [calGoal, setCalGoal] = useState(String(profile.dailyCalorieGoal));

  const saveName = useCallback(() => {
    const trimmed = name.trim();
    if (trimmed && trimmed !== profile.name) {
      updateProfile({ name: trimmed });
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [name, profile.name, updateProfile]);

  const saveCalGoal = useCallback(() => {
    const val = parseInt(calGoal, 10);
    if (!isNaN(val) && val > 0 && val !== profile.dailyCalorieGoal) {
      updateProfile({ dailyCalorieGoal: val });
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [calGoal, profile.dailyCalorieGoal, updateProfile]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 120, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar / name header */}
        <View style={{ alignItems: 'center', marginBottom: 28 }}>
          <View style={{ width: 72, height: 72, borderRadius: 24, backgroundColor: colors.accentDim, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 28, color: colors.accent }}>
              {profile.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <TextInput
            value={name}
            onChangeText={setName}
            onBlur={saveName}
            style={{
              fontFamily: 'Inter_700Bold',
              fontSize: 22,
              color: colors.textPrimary,
              textAlign: 'center',
              padding: 4,
            }}
            testID="profile-name-input"
          />
          {isPro ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.accentDim, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginTop: 6 }}>
              <Crown size={12} color={colors.accent} />
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: colors.accent, marginLeft: 4 }}>Premium</Text>
            </View>
          ) : null}
        </View>

        {/* Calorie Goal */}
        <View style={{ backgroundColor: colors.bgCard, borderRadius: radii.lg, padding: 18, marginBottom: 20 }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.textPrimary, marginBottom: 12 }}>Daily Calorie Goal</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              value={calGoal}
              onChangeText={setCalGoal}
              onBlur={saveCalGoal}
              keyboardType="number-pad"
              style={{
                fontFamily: 'Inter_800ExtraBold',
                fontSize: 36,
                color: colors.accent,
                letterSpacing: -1,
                flex: 1,
              }}
              testID="calorie-goal-input"
            />
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 16, color: colors.textMuted }}>kcal</Text>
          </View>
        </View>

        {/* Macro Targets */}
        <View style={{ backgroundColor: colors.bgCard, borderRadius: radii.lg, padding: 18, marginBottom: 20 }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.textPrimary, marginBottom: 14 }}>Macro Targets</Text>
          <SliderRow label="Protein" value={profile.proteinPct} onChange={(v) => updateProfile({ proteinPct: v })} min={5} max={60} suffix="%" />
          <SliderRow label="Carbs" value={profile.carbsPct} onChange={(v) => updateProfile({ carbsPct: v })} min={5} max={70} suffix="%" />
          <SliderRow label="Fat" value={profile.fatPct} onChange={(v) => updateProfile({ fatPct: v })} min={5} max={60} suffix="%" />
        </View>

        {/* Optional fields */}
        <View style={{ backgroundColor: colors.bgCard, borderRadius: radii.lg, padding: 18, marginBottom: 20 }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.textPrimary, marginBottom: 10 }}>Body Stats</Text>
          <SettingRow icon={Cake} label="Age" value={profile.age || 'Not set'} />
          <SettingRow icon={Scale} label="Weight" value={profile.weight || 'Not set'} />
          <SettingRow icon={Ruler} label="Height" value={profile.height || 'Not set'} />
        </View>

        {/* Premium */}
        {!isPro ? (
          <Pressable
            onPress={() => router.push('/paywall')}
            style={{
              backgroundColor: colors.bgCard,
              borderRadius: radii.lg,
              padding: 18,
              marginBottom: 20,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(34,197,94,0.25)',
            }}
            accessibilityLabel="Upgrade to Premium"
            testID="upgrade-btn"
          >
            <Crown size={22} color={colors.accent} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.textPrimary }}>Upgrade to Premium</Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>Export data, AI photo recognition & more</Text>
            </View>
            <ChevronRight size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}

        {/* Logout placeholder */}
        <Pressable
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16 }}
          accessibilityLabel="Log out"
          testID="logout-btn"
        >
          <LogOut size={16} color={colors.destructive} />
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.destructive, marginLeft: 8 }}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
