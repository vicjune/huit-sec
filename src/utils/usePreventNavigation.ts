import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';

export const usePreventNavigation = () => {
  const navigation = useNavigation();
  const [allowNav, setAllowNav] = useState(false);
  const [pageIsFocus, setPageIsFocus] = useState(false);

  useEffect(() => {
    const unsubscribeBeforeRemove = navigation.addListener(
      'beforeRemove',
      (e) => {
        if (!allowNav) {
          e.preventDefault();
        }
      },
    );

    const unsubscribeFocus = navigation.addListener('focus', () => {
      setPageIsFocus(true);
    });
    const unsubscribeBlur = navigation.addListener('blur', () => {
      setPageIsFocus(false);
    });

    return () => {
      unsubscribeBeforeRemove();
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation, allowNav, pageIsFocus]);

  useEffect(() => {
    if (pageIsFocus) setAllowNav(false);
  }, [pageIsFocus]);

  return (args: any) => {
    setAllowNav(true);
    setTimeout(() => {
      navigation.navigate(args);
    });
  };
};
