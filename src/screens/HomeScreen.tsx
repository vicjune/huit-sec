import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { BasicButton } from '../components/BasicButton';
import { ScreenWrapper } from '../components/ScreenWrapper';

export const HomeScreen: FC = () => {
  const navigation = useNavigation();

  return (
    <ScreenWrapper style={styles.container}>
      <BasicButton
        text="Nouvelle partie"
        onPress={() => navigation.navigate('Question')}
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
