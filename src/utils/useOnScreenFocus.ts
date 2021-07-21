import { useNavigation } from '@react-navigation/native';
import { EffectCallback, useEffect } from 'react';

export const useOnScreenFocus = (effect: EffectCallback) => {
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', effect);

    return () => {
      unsubscribe();
    };
  }, [navigation, effect]);
};

export const useOnScreenBlur = (effect: EffectCallback) => {
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', effect);

    return () => {
      unsubscribe();
    };
  }, [navigation, effect]);
};
