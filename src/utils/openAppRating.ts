import Rate, { AndroidMarket } from 'react-native-rate';
import { storage, STORAGE_LAST_RATING } from './storage';

const DELAY_BETWEEN_DEMAND = 2629800000; // 1 month

export const openAppRating = async () => {
  const lastRatingTimestamp = await storage.get<number>(STORAGE_LAST_RATING);

  if (
    !lastRatingTimestamp ||
    Date.now() - lastRatingTimestamp >= DELAY_BETWEEN_DEMAND
  ) {
    Rate.rate(
      {
        AppleAppID: '1575772508',
        GooglePackageName: 'com.huitsec',
        preferredAndroidMarket: AndroidMarket.Google,
        preferInApp: true,
        openAppStoreIfInAppFails: false,
      },
      (success) => {
        if (success) {
          storage.set(STORAGE_LAST_RATING, Date.now());
        }
      },
    );
  }
};
