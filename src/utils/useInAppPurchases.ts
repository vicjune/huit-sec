import { useCallback, useEffect, useState } from 'react';
import { EmitterSubscription } from 'react-native';
import {
  requestPurchase,
  purchaseErrorListener,
  IAPErrorCode,
  clearProductsIOS,
  initConnection,
  getProducts,
  getAvailablePurchases,
  purchaseUpdatedListener,
  finishTransaction,
} from 'react-native-iap';
import { BundleId, bundles } from '../const/bundles';
import { useGlobalState } from '../contexts/GlobalState';
import { useNotification } from './useNotification';

export const useInAppPurchases = () => {
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const { showNotification } = useNotification();
  const { globalState, setGlobalState } = useGlobalState();

  const loadAvailablePurchases = useCallback(async () => {
    const availablePurchases = await getAvailablePurchases();
    setGlobalState((prev) => ({ ...prev, availablePurchases }));
  }, [setGlobalState]);

  const loadProducts = useCallback(async () => {
    clearProductsIOS();
    setGlobalState((prev) => ({ ...prev, productsLoading: true }));
    try {
      await initConnection();
      const products = await getProducts(
        bundles
          .filter(({ lockedByDefault }) => lockedByDefault)
          .map(({ id }) => id),
      );
      setGlobalState((prev) => ({ ...prev, products }));
      await loadAvailablePurchases();
    } catch (e) {
      showNotification(e.message);
    }
    setGlobalState((prev) => ({ ...prev, productsLoading: false }));
  }, [setGlobalState, showNotification, loadAvailablePurchases]);

  useEffect(() => {
    let purchaseUpdateSubscription: EmitterSubscription;
    let purchaseErrorSubscription: EmitterSubscription;

    (async () => {
      try {
        await initConnection();
        purchaseUpdateSubscription = purchaseUpdatedListener(
          async (purchase) => {
            const receipt = purchase.transactionReceipt;
            if (receipt) {
              try {
                await finishTransaction(purchase);
                loadAvailablePurchases();
              } catch (e) {
                showNotification(e.message);
              }
            }
          },
        );

        purchaseErrorSubscription = purchaseErrorListener((e) => {
          setPurchaseLoading(false);
          if (e.code !== IAPErrorCode.E_USER_CANCELLED) {
            showNotification(e.message);
          }
        });
      } catch (e) {
        showNotification(e.message);
      }
    })();

    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
      }
    };
  }, [showNotification, loadAvailablePurchases]);

  const purchase = useCallback(
    async (id: BundleId) => {
      setPurchaseLoading(true);
      try {
        await requestPurchase(id);
      } catch (e) {
        showNotification(e.message);
      }
      setPurchaseLoading(false);
    },
    [showNotification],
  );

  return {
    loadProducts,
    purchase,
    purchaseLoading,
    productsLoading: globalState.productsLoading,
  };
};
