import React, { FC } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/colors';

interface ScreenWrapperProps {
  style?: Record<string, unknown>;
  wrapperStyle?: Record<string, unknown>;
}

export const ScreenWrapper: FC<ScreenWrapperProps> = ({
  children,
  style,
  wrapperStyle,
}) => {
  return (
    <View style={{ ...styles.wrapper, ...wrapperStyle }}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ ...styles.inside, ...style }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {children}
        </KeyboardAvoidingView>
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
