import React, { FC } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../styles/colors';

type Size = 'normal' | 'small';

interface ButtonProps {
  text: string;
  onPress?: () => void;
  size?: Size;
  disabled?: boolean;
  round?: boolean;
  style?: Record<string, unknown>;
}

export const BasicButton: FC<ButtonProps> = ({
  text,
  onPress,
  size = 'normal',
  disabled,
  round,
  style,
}) => {
  const styles = getStyles(size, round);

  return (
    <Pressable
      style={({ pressed }) => [
        { ...styles.button, ...style },
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {({ pressed }) => (
        <Text style={[styles.buttonText, pressed && styles.buttonTextPressed]}>
          {text}
        </Text>
      )}
    </Pressable>
  );
};

const getStyles = (size: Size, round?: boolean) =>
  StyleSheet.create({
    button: {
      alignItems: 'center',
      borderColor: colors.basicButton,
      borderWidth: 1,
      padding: size === 'normal' ? 15 : 12,
      alignSelf: 'center',
      borderRadius: round ? 100 : 0,
    },
    buttonPressed: {
      backgroundColor: colors.basicButton,
    },
    buttonText: {
      color: 'white',
      textTransform: 'uppercase',
      fontSize: size === 'normal' ? 20 : 16,
    },
    buttonTextPressed: {
      color: colors.background,
    },
  });
