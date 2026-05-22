import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

/**
 * Configure RevenueCat Purchases SDK.
 * Safe to call on web (no-ops) and when key is missing (no-ops).
 */
export function configurePurchases(apiKey: string | undefined) {
  // No-op on web - RevenueCat is native-only
  if (Platform.OS === 'web') return;

  // No-op if key is missing
  if (!apiKey || apiKey.trim() === '') {
    console.warn('[purchases] EXPO_PUBLIC_REVENUECAT_IOS_KEY not set - paywall will not work');
    return;
  }

  try {
    // Set log level based on environment
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    } else {
      Purchases.setLogLevel(LOG_LEVEL.WARN);
    }

    // Configure the SDK with the iOS key
    Purchases.configure({ apiKey });
    console.log('[purchases] RevenueCat configured successfully');
  } catch (error) {
    console.error('[purchases] Failed to configure RevenueCat:', error);
  }
}
