import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { EmitterSubscription } from 'react-native';
import {
  clearProductsIOS,
  finishTransaction,
  getAvailablePurchases,
  getProducts,
  IAPErrorCode,
  initConnection,
  Product,
  Purchase,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
} from 'react-native-iap';
import { storage, STORAGE_AVAILABLE_PURCHASES } from '../utils/storage';
import { useNotification } from '../utils/useNotification';

interface InAppPurchasesContext {
  loadProducts: () => Promise<void>;
  purchase: (id: string) => Promise<void>;
  purchaseLoading: boolean;
  productsLoading: boolean;
  products: Product<string>[];
  availablePurchases: Purchase[];
}

const inAppPurchasesContext = createContext<InAppPurchasesContext>({
  loadProducts: () => Promise.resolve(),
  purchase: () => Promise.resolve(),
  purchaseLoading: false,
  productsLoading: false,
  products: [],
  availablePurchases: [],
});

interface InAppPurchasesProviderProps {
  productIds?: string[];
}

export const InAppPurchasesProvider: FC<InAppPurchasesProviderProps> = ({
  productIds,
  children,
}) => {
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [products, setProducts] = useState<Product<string>[]>([]);
  const [availablePurchases, setAvailablePurchases] = useState<Purchase[]>([]);
  const { showNotification } = useNotification();

  const loadProducts = useCallback(async () => {
    clearProductsIOS();
    setProductsLoading(true);
    try {
      const storedPurchases = await storage.get<Purchase[]>(
        STORAGE_AVAILABLE_PURCHASES,
      );
      if (storedPurchases) {
        setAvailablePurchases(storedPurchases);
      }
      await initConnection();
      const productsRes = await getProducts(productIds || []);
      setProducts(productsRes);
      const purchases = await getAvailablePurchases();
      setAvailablePurchases(purchases);
      storage.set(STORAGE_AVAILABLE_PURCHASES, purchases);
    } catch (e) {
      showNotification(e.message);
    }
    setProductsLoading(false);
  }, [showNotification, productIds]);

  useEffect(() => {
    loadProducts();

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
                // To avoid Google error even when purchase was successful
                // showNotification(e.message);
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
    async (id: string) => {
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

  return (
    <inAppPurchasesContext.Provider
      value={{
        loadProducts,
        purchase,
        products,
        availablePurchases,
        productsLoading,
        purchaseLoading,
      }}
    >
      {children}
    </inAppPurchasesContext.Provider>
  );
};

export const useInAppPurchases = () => useContext(inAppPurchasesContext);
