import { useCallback } from 'react';
import Toast from 'react-native-simple-toast';

export const useNotification = () => {
  const showNotification = useCallback((message?: string) => {
    message &&
      Toast.showWithGravity(message, Toast.SHORT, Toast.TOP, [
        'UIAlertController',
      ]);
  }, []);

  return { showNotification };
};
