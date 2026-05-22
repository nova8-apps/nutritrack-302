import React from 'react';
import { View, Text } from 'react-native';
import { type LucideIcon } from 'lucide-react-native';
import { colors } from '@/lib/theme';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

export function EmptyState({ icon: Icon, title, subtitle }: EmptyStateProps) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 48 }}>
      <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: colors.accentDim, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Icon size={28} color={colors.accent} />
      </View>
      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 17, color: colors.textPrimary, marginBottom: 6 }}>
        {title}
      </Text>
      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, textAlign: 'center', paddingHorizontal: 32 }}>
        {subtitle}
      </Text>
    </View>
  );
}
