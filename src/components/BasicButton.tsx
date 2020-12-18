import React, { FC } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../styles/colors';

type Size = 'normal' | 'small';

interface ButtonProps {
  text?: string;
  onPress?: () => void;
  size?: Size;
  disabled?: boolean;
  style?: Record<string, unknown>;
  icon?: string;
}

export const BasicButton: FC<ButtonProps> = ({
  text,
  onPress,
  size = 'normal',
  disabled,
  style,
  icon,
}) => {
  const styles = getStyles(size, !text);

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
        <>
          {icon && (
            <Icon
              name={icon}
              size={size === 'normal' ? 24 : 16}
              color={pressed ? colors.background : colors.basicButton}
              style={styles.icon}
            />
          )}
          {text && (
            <Text
              style={[styles.buttonText, pressed && styles.buttonTextPressed]}
            >
              {text}
            </Text>
          )}
        </>
      )}
    </Pressable>
  );
};

const getStyles = (size: Size, noText: boolean) =>
  StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      borderColor: colors.basicButton,
      borderWidth: 1,
      padding: size === 'normal' ? 15 : 12,
      alignSelf: 'center',
      width: noText ? (size === 'normal' ? 60 : 40) : undefined,
      height: noText ? (size === 'normal' ? 60 : 40) : undefined,
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
    icon: {
      marginRight: !noText ? 10 : 0,
    },
  });
