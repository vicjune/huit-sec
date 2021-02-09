import { useNavigation } from '@react-navigation/native';
import { EffectCallback, useEffect } from 'react';

export const useOnScreenFocus = (effect: EffectCallback) => {
  const navigation = useNavigation();
  useEffect(() => navigation.addListener('focus', effect), [
    navigation,
    effect,
  ]);
};

export const useOnScreenBlur = (effect: EffectCallback) => {
  const navigation = useNavigation();
  useEffect(() => navigation.addListener('blur', effect), [navigation, effect]);
};
