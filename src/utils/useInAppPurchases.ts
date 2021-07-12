import { useCallback, useEffect, useState } from 'react';
import { EmitterSubscription } from 'react-native';
import {
  requestPurchase,
  useIAP,
  purchaseErrorListener,
  IAPErrorCode,
  clearProductsIOS,
  initConnection,
  getProducts,
  getAvailablePurchases,
} from 'react-native-iap';
import { BundleId, bundles } from '../const/bundles';
import { useGlobalState } from '../contexts/GlobalState';
import { useNotification } from './useNotification';

export const useInAppPurchases = () => {
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const { showNotification } = useNotification();
  const { globalState, setGlobalState } = useGlobalState();
  const { connected, finishTransaction, currentPurchase } = useIAP();

  const loadAvailablePurchases = useCallback(async () => {
    const availablePurchases = await getAvailablePurchases();
    setGlobalState((prev) => ({ ...prev, availablePurchases }));
    console.log(
      'availablePurchases',
      availablePurchases.map(({ productId }) => productId),
    );
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
      console.log(
        'products',
        products.map(({ productId }) => productId),
      );
      await loadAvailablePurchases();
    } catch (e) {
      showNotification(e.message);
    }
    setGlobalState((prev) => ({ ...prev, productsLoading: false }));
  }, [setGlobalState, showNotification, loadAvailablePurchases]);

  useEffect(() => {
    let purchaseErrorSubscription: EmitterSubscription;

    if (connected) {
      purchaseErrorSubscription = purchaseErrorListener((e) => {
        setPurchaseLoading(false);
        if (e.code !== IAPErrorCode.E_USER_CANCELLED) {
          showNotification(e.message);
        }
      });
    }

    return () => {
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
      }
    };
  }, [connected, showNotification]);

  useEffect(() => {
    (async () => {
      if (currentPurchase) {
        console.log('currentPurchase');
        const receipt = currentPurchase.transactionReceipt;
        if (receipt) {
          console.log('receipt');
          try {
            console.log('finishTransaction');
            await finishTransaction(currentPurchase);
            loadAvailablePurchases();
          } catch (e) {
            console.log('finishTransaction error', e.message);
            showNotification(e.message);
          }
          console.log('finishTransaction done');
        }
      }
    })();
  }, [
    currentPurchase,
    finishTransaction,
    showNotification,
    loadAvailablePurchases,
  ]);

  const purchase = useCallback(
    async (id: BundleId) => {
      setPurchaseLoading(true);
      try {
        console.log('requestPurchase');
        await requestPurchase(id);
      } catch (e) {
        showNotification(e.message);
        console.log('requestPurchase error', e.message);
      }
      console.log('requestPurchase done');
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
