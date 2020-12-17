import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/colors';

interface ScreenWrapperProps {
  style?: Record<string, unknown>;
}

export const ScreenWrapper: FC<ScreenWrapperProps> = ({ children, style }) => {
  return (
    <View style={styles.wrapper}>
      <SafeAreaView style={styles.safeArea}>
        <View style={{ ...style, ...styles.inside }}>{children}</View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  inside: {
    position: 'relative',
    flex: 1,
  },
});
