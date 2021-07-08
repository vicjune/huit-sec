import React, { FC } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/colors';
import LinearGradient from 'react-native-linear-gradient';

interface ScreenWrapperProps {
  style?: Record<string, unknown>;
  wrapperStyle?: Record<string, unknown>;
  backgroundColors?: (string | number)[];
}

export const ScreenWrapper: FC<ScreenWrapperProps> = ({
  children,
  style,
  wrapperStyle,
  backgroundColors,
}) => {
  return (
    <LinearGradient
      colors={backgroundColors || [colors.backgroundLighter, colors.background]}
      style={{ ...styles.wrapper, ...wrapperStyle }}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={{ ...styles.inside, ...style }}>{children}</View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  inside: {
    position: 'relative',
    flex: 1,
  },
});
