import React, { useState, useEffect } from 'react';
import { Platform, Alert, Linking } from 'react-native';
import { router } from 'expo-router';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';
import { Pressable } from '@/components/ui/pressable';
import { Spinner } from '@/components/ui/spinner';
import { X, Check, Camera, FileText, UtensilsCrossed } from 'lucide-react-native';
import { colors } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import Purchases, { PurchasesPackage, PurchasesOfferings } from 'react-native-purchases';

export default function PaywallScreen() {
  const setIsPro = useAppStore(s => s.setIsPro);

  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      loadOfferings();
    } else {
      setLoading(false);
    }
  }, []);

  async function loadOfferings() {
    try {
      const offers = await Purchases.getOfferings();
      setOfferings(offers);
    } catch (err) {
      console.warn('[RevenueCat] Failed to load offerings:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handlePurchase(pkg: PurchasesPackage) {
    if (purchasing) return;

    try {
      setPurchasing(true);
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      const hasPro = !!customerInfo.entitlements.active['pro'];
      setIsPro(hasPro);

      if (hasPro) {
        router.back();
      }
    } catch (err: any) {
      if (err?.code === 'PURCHASE_CANCELLED') {
        // User cancelled - do nothing
        return;
      }
      Alert.alert('Purchase Failed', err?.message || 'Something went wrong. Please try again.');
    } finally {
      setPurchasing(false);
    }
  }

  async function handleRestore() {
    if (purchasing) return;

    try {
      setPurchasing(true);
      const customerInfo = await Purchases.restorePurchases();
      const hasPro = !!customerInfo.entitlements.active['pro'];
      setIsPro(hasPro);

      if (hasPro) {
        Alert.alert('Success', 'Your purchases have been restored.');
        router.back();
      } else {
        Alert.alert('No Purchases Found', "We couldn't find any previous purchases to restore.");
      }
    } catch (err: any) {
      Alert.alert('Restore Failed', err?.message || 'Something went wrong. Please try again.');
    } finally {
      setPurchasing(false);
    }
  }

  const currentOffering = offerings?.current;
  const packages = currentOffering?.availablePackages || [];
  const monthlyPkg = packages.find(p => p.identifier === '$rc_monthly');
  const annualPkg = packages.find(p => p.identifier === '$rc_annual');

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg }}>
      {/* Close button */}
      <Pressable
        onPress={() => router.back()}
        className="absolute top-12 right-5 z-10"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="Close paywall"
      >
        <X size={24} color={colors.textSecondary} />
      </Pressable>

      <VStack className="flex-1 px-6 pt-20 pb-8" space="2xl">
        {/* Header */}
        <VStack space="md" className="items-center">
          <Heading size="3xl" className="text-center" style={{ color: colors.textPrimary, fontFamily: 'Inter_800ExtraBold' }}>
            Unlock Premium
          </Heading>
          <Text size="md" className="text-center" style={{ color: colors.textSecondary }}>
            Get advanced features and take full control of your nutrition tracking
          </Text>
        </VStack>

        {/* Features */}
        <VStack space="lg" className="py-6">
          <HStack space="md" className="items-start">
            <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: colors.accent + '20' }}>
              <Camera size={20} color={colors.accent} />
            </View>
            <VStack space="xs" className="flex-1">
              <Text size="lg" className="font-semibold" style={{ color: colors.textPrimary }}>
                AI Photo Recognition
              </Text>
              <Text size="sm" style={{ color: colors.textSecondary }}>
                Snap a photo and get instant nutritional breakdowns for any meal
              </Text>
            </VStack>
          </HStack>

          <HStack space="md" className="items-start">
            <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: colors.accent + '20' }}>
              <FileText size={20} color={colors.accent} />
            </View>
            <VStack space="xs" className="flex-1">
              <Text size="lg" className="font-semibold" style={{ color: colors.textPrimary }}>
                Export Meal History
              </Text>
              <Text size="sm" style={{ color: colors.textSecondary }}>
                Download your complete nutrition data as CSV for analysis
              </Text>
            </VStack>
          </HStack>

          <HStack space="md" className="items-start">
            <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: colors.accent + '20' }}>
              <UtensilsCrossed size={20} color={colors.accent} />
            </View>
            <VStack space="xs" className="flex-1">
              <Text size="lg" className="font-semibold" style={{ color: colors.textPrimary }}>
                Custom Meal Recipes
              </Text>
              <Text size="sm" style={{ color: colors.textSecondary }}>
                Save your favorite meals and log them with one tap
              </Text>
            </VStack>
          </HStack>
        </VStack>

        {/* Spacer */}
        <View className="flex-1" />

        {/* Pricing */}
        {loading ? (
          <View className="items-center py-8">
            <Spinner size="large" color={colors.accent} />
          </View>
        ) : Platform.OS !== 'ios' ? (
          <VStack space="md" className="py-6">
            <Text size="sm" className="text-center" style={{ color: colors.textSecondary }}>
              In-app purchases are only available on iOS.
            </Text>
            <Button onPress={() => router.back()} className="rounded-xl" style={{ backgroundColor: colors.surfaceElevated }}>
              <ButtonText style={{ color: colors.textPrimary }}>Continue Free</ButtonText>
            </Button>
          </VStack>
        ) : !currentOffering ? (
          <VStack space="md" className="py-6">
            <Text size="sm" className="text-center" style={{ color: colors.textSecondary }}>
              Offers are not available at the moment. Please try again later.
            </Text>
            <Button onPress={() => router.back()} className="rounded-xl" style={{ backgroundColor: colors.surfaceElevated }}>
              <ButtonText style={{ color: colors.textPrimary }}>Continue Free</ButtonText>
            </Button>
          </VStack>
        ) : (
          <VStack space="md">
            {/* Annual package */}
            {annualPkg && (
              <Pressable
                onPress={() => handlePurchase(annualPkg)}
                disabled={purchasing}
                className="rounded-2xl p-4 border-2"
                style={{ backgroundColor: colors.surfaceElevated, borderColor: colors.accent }}
                accessibilityLabel={`Subscribe annually for ${annualPkg.product.priceString}`}
              >
                <HStack className="items-center justify-between">
                  <VStack space="xs">
                    <HStack space="xs" className="items-center">
                      <Text size="lg" className="font-bold" style={{ color: colors.textPrimary }}>
                        Annual
                      </Text>
                      <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: colors.accent }}>
                        <Text size="xs" className="font-semibold" style={{ color: colors.bg }}>
                          SAVE 30%
                        </Text>
                      </View>
                    </HStack>
                    <Text size="sm" style={{ color: colors.textSecondary }}>
                      Billed once per year
                    </Text>
                  </VStack>
                  <Text size="2xl" className="font-bold" style={{ color: colors.accent }}>
                    {annualPkg.product.priceString}
                  </Text>
                </HStack>
              </Pressable>
            )}

            {/* Monthly package */}
            {monthlyPkg && (
              <Pressable
                onPress={() => handlePurchase(monthlyPkg)}
                disabled={purchasing}
                className="rounded-2xl p-4 border"
                style={{ backgroundColor: colors.bgCard, borderColor: colors.border }}
                accessibilityLabel={`Subscribe monthly for ${monthlyPkg.product.priceString}`}
              >
                <HStack className="items-center justify-between">
                  <VStack space="xs">
                    <Text size="lg" className="font-bold" style={{ color: colors.textPrimary }}>
                      Monthly
                    </Text>
                    <Text size="sm" style={{ color: colors.textSecondary }}>
                      Billed every month
                    </Text>
                  </VStack>
                  <Text size="2xl" className="font-bold" style={{ color: colors.textPrimary }}>
                    {monthlyPkg.product.priceString}
                  </Text>
                </HStack>
              </Pressable>
            )}

            {/* Restore button */}
            <Pressable
              onPress={handleRestore}
              disabled={purchasing}
              className="py-3"
              accessibilityLabel="Restore purchases"
            >
              <Text size="sm" className="text-center font-semibold" style={{ color: colors.accent }}>
                {purchasing ? 'Processing...' : 'Restore Purchases'}
              </Text>
            </Pressable>

            {/* Continue free */}
            <Pressable
              onPress={() => router.back()}
              disabled={purchasing}
              className="py-3"
              accessibilityLabel="Continue with free version"
            >
              <Text size="sm" className="text-center" style={{ color: colors.textSecondary }}>
                Continue Free
              </Text>
            </Pressable>

            {/* Legal links */}
            <HStack space="md" className="items-center justify-center pt-2">
              <Pressable
                onPress={() => Linking.openURL('https://nova8.dev/terms')}
                accessibilityLabel="View terms of service"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text size="xs" style={{ color: colors.textSecondary }}>Terms</Text>
              </Pressable>
              <Text size="xs" style={{ color: colors.textSecondary }}>•</Text>
              <Pressable
                onPress={() => router.push('/privacy')}
                accessibilityLabel="View privacy policy"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text size="xs" style={{ color: colors.textSecondary }}>Privacy</Text>
              </Pressable>
            </HStack>
          </VStack>
        )}
      </VStack>
    </View>
  );
}
