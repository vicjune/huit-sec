import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';

export const usePreventNavigation = (allow?: boolean) => {
  const navigation = useNavigation();
  const [allowNav, setAllowNav] = useState(false);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (!allow && !allowNav) {
          e.preventDefault();
        }
      }),
    [navigation, allow, allowNav],
  );

  return (args: any) => {
    setAllowNav(true);
    setTimeout(() => {
      navigation.navigate(args);
    });
  };
};
