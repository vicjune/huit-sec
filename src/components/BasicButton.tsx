import React, { ElementType, FC } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../styles/colors';

interface ButtonProps {
  text?: string;
  onPress?: () => void;
  small?: boolean;
  disabled?: boolean;
  style?: Record<string, unknown>;
  icon: string;
  IconElem: ElementType;
  color?: string;
}

export const BasicButton: FC<ButtonProps> = ({
  text,
  onPress,
  small,
  disabled,
  style,
  icon,
  IconElem,
  color = colors.white,
}) => {
  const styles = getStyles(!text, color, small, disabled);

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
          <IconElem
            name={icon}
            size={small ? 30 : 50}
            color={pressed ? colors.background : color}
          />
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

const getStyles = (
  noText: boolean,
  color: string,
  small?: boolean,
  disabled?: boolean,
) =>
  StyleSheet.create({
    button: {
      alignSelf: 'center',
      height: small ? 60 : 120,
      width: small ? 60 : 120,
      borderRadius: small ? 60 : 120,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: noText ? 0 : 5,
      borderWidth: small ? 1 : 5,
      borderColor: color,
      opacity: disabled ? 0.5 : 1,
    },
    buttonPressed: {
      backgroundColor: color,
    },
    buttonText: {
      fontSize: small ? 10 : 16,
      color,
      alignSelf: 'center',
    },
    buttonTextPressed: {
      color: colors.background,
    },
  });
