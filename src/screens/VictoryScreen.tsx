import React, { FC } from 'react';
import { StyleSheet, Text } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';

export const VictoryScreen: FC = () => {
  const styles = getStyles();

  return (
    <ScreenWrapper style={styles.wrapper}>
      <Text>Victory</Text>
    </ScreenWrapper>
  );
};

const getStyles = () =>
  StyleSheet.create({
    wrapper: {},
  });
