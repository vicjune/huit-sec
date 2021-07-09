import { useCallback, useEffect, useState } from 'react';
import {
  requestPurchase,
  useIAP,
  getAvailablePurchases,
  purchaseErrorListener,
  IAPErrorCode,
} from 'react-native-iap';
import { BundleId, bundles } from '../const/bundles';
import { useGlobalState } from '../contexts/GlobalState';
import { useNotification } from './useNotification';

export const useInAppPurchases = () => {
  const [productsLoading, setProductsLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const { showNotification } = useNotification();
  const { setGlobalState } = useGlobalState();
  const {
    connected,
    products,
    getProducts,
    finishTransaction,
    currentPurchase,
  } = useIAP();

  const updateAvailablePurchases = useCallback(async () => {
    setProductsLoading(true);
    try {
      const res = await getAvailablePurchases();
      setGlobalState((prev) => ({
        ...prev,
        purchasedBundleIds: res.map(({ productId }) => productId as BundleId),
      }));
    } catch (e) {
      showNotification(e.message);
    }
    setProductsLoading(false);
  }, [setGlobalState, showNotification]);

  useEffect(() => {
    const purchaseErrorSubscription = purchaseErrorListener((e) => {
      setPurchaseLoading(false);
      if (e.code !== IAPErrorCode.E_USER_CANCELLED) {
        showNotification(e.message);
      }
    });

    return () => {
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
      }
    };
  }, [showNotification]);

  useEffect(() => {
    if (connected) {
      getProducts(
        bundles
          .filter(({ lockedByDefault }) => lockedByDefault)
          .map(({ id }) => id),
      );
    }
  }, [getProducts, connected]);

  useEffect(() => {
    (async () => {
      if (currentPurchase) {
        const receipt = currentPurchase.transactionReceipt;
        if (receipt) {
          try {
            await finishTransaction(currentPurchase);
            updateAvailablePurchases();
          } catch (e) {
            showNotification(e.message);
          }
        }
      }
    })();
  }, [
    currentPurchase,
    finishTransaction,
    showNotification,
    updateAvailablePurchases,
  ]);

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
    updateAvailablePurchases,
    products,
    purchase,
    purchaseLoading,
    productsLoading,
  };
};
