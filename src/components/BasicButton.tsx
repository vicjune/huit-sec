import React, { FC } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../styles/colors';

interface ButtonProps {
  text: string;
  onPress?: () => void;
}

export const BasicButton: FC<ButtonProps> = ({ text, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={onPress}
    >
      {({ pressed }) => (
        <Text style={[styles.buttonText, pressed && styles.buttonTextPressed]}>
          {text}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderColor: colors.basicButton,
    borderWidth: 1,
    padding: 15,
  },
  buttonPressed: {
    backgroundColor: colors.basicButton,
  },
  buttonText: {
    color: 'white',
    textTransform: 'uppercase',
    fontSize: 20,
  },
  buttonTextPressed: {
    color: colors.background,
  },
});
