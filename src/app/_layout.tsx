import React from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PreviewErrorReporter } from '@/components/PreviewErrorReporter';
import { PreviewModeBanner } from '@/components/PreviewModeBanner';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { colors } from '@/lib/theme';
import { configurePurchases } from '@/lib/purchases';
import { useAppStore } from '@/lib/store';
import Purchases from 'react-native-purchases';
import { AppState as RNAppState } from 'react-native';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const setIsPro = useAppStore(s => s.setIsPro);
  const setIsCheckingEntitlement = useAppStore(s => s.setIsCheckingEntitlement);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Configure RevenueCat on iOS and check entitlement
  React.useEffect(() => {
    if (Platform.OS === 'ios') {
      configurePurchases(process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY);
      checkEntitlement();
    }
  }, []);

  // Re-check entitlement on app resume
  React.useEffect(() => {
    if (Platform.OS !== 'ios') return;

    const subscription = RNAppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        checkEntitlement();
      }
    });

    return () => subscription.remove();
  }, []);

  async function checkEntitlement() {
    if (Platform.OS !== 'ios') return;

    try {
      setIsCheckingEntitlement(true);
      const customerInfo = await Purchases.getCustomerInfo();
      const hasPro = !!customerInfo.entitlements.active['pro'];
      setIsPro(hasPro);
    } catch (err) {
      console.warn('[RevenueCat] Failed to check entitlement:', err);
      // Keep existing isPro state on error
    } finally {
      setIsCheckingEntitlement(false);
    }
  }

  if (!fontsLoaded) return null;

  return (
    <PreviewErrorReporter>
      <ErrorBoundary>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <GluestackUIProvider mode="dark">
              <StatusBar style="light" />
              <PreviewModeBanner />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: colors.bg },
                  animation: 'slide_from_right',
                }}
              >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
                <Stack.Screen name="log-meal" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
                <Stack.Screen name="meal-detail" options={{ animation: 'slide_from_right' }} />
                <Stack.Screen name="paywall" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
              </Stack>
            </GluestackUIProvider>
          </QueryClientProvider>
        </SafeAreaProvider>
      </ErrorBoundary>
    </PreviewErrorReporter>
  );
}
