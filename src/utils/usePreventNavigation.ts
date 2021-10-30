import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useOnScreenFocus } from './useOnScreenFocus';

export const usePreventNavigation = () => {
  const navigation = useNavigation();
  const [allowNav, setAllowNav] = useState(false);

  useOnScreenFocus(() => {
    setAllowNav(false);
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!allowNav) {
        e.preventDefault();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, allowNav]);

  return (args: any) => {
    setAllowNav(true);
    setTimeout(() => {
      navigation.navigate(args);
    });
  };
};
