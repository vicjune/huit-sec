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
  const { productsLoading, products, availablePurchases } = globalState;

  const loadProducts = useCallback(async () => {
    clearProductsIOS();
    setGlobalState((prev) => ({ ...prev, productsLoading: true }));
    try {
      await initConnection();
      const prod = await getProducts(
        bundles
          .filter(({ lockedByDefault }) => lockedByDefault)
          .map(({ id }) => id),
      );
      setGlobalState((prev) => ({ ...prev, products: prod }));
      const purchases = await getAvailablePurchases();
      setGlobalState((prev) => ({ ...prev, availablePurchases: purchases }));
    } catch (e) {
      showNotification(e.message);
    }
    setGlobalState((prev) => ({ ...prev, productsLoading: false }));
  }, [setGlobalState, showNotification]);

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
                loadProducts();
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
  }, [showNotification, loadProducts]);

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
    productsLoading,
    products,
    availablePurchases,
  };
};
