import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { BasicButton } from '../components/BasicButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Sound, useSound } from '../components/Sound';

export const HomeScreen: FC = () => {
  const navigation = useNavigation();
  const { playSound } = useSound();

  return (
    <ScreenWrapper style={styles.container}>
      <BasicButton
        text="Nouvelle partie"
        onPress={() => {
          playSound(Sound.CLICK);
          navigation.navigate('SwitchPlayer');
        }}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
