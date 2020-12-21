import React, { FC } from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';
import { colors } from '../styles/colors';

interface InputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  style?: Record<string, unknown>;
  disabled?: boolean;
  placeholder?: string;
}

export const Input: FC<InputProps> = ({
  value,
  onChange,
  onSubmit,
  disabled,
  style,
  placeholder,
}) => {
  const styles = getStyles(disabled);

  return (
    <View style={{ ...styles.wrapper, ...style }}>
      {!!placeholder && !value && (
        <View style={styles.placeholderWrapper}>
          <Text style={styles.placeholder}>{placeholder}</Text>
        </View>
      )}
      <TextInput
        style={styles.input}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
        value={value}
        autoCompleteType="name"
        blurOnSubmit={false}
        enablesReturnKeyAutomatically
        editable={!disabled}
      />
    </View>
  );
};

const getStyles = (disabled?: boolean) =>
  StyleSheet.create({
    wrapper: {
      opacity: disabled ? 0.5 : 1,
      flexDirection: 'row',
      position: 'relative',
    },
    input: {
      flex: 1,
      height: 50,
      fontSize: 20,
      paddingLeft: 10,
      paddingRight: 10,
      color: colors.white,
    },
    placeholderWrapper: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
    },
    placeholder: {
      fontSize: 20,
      paddingLeft: 10,
      paddingRight: 10,
      color: colors.white,
      opacity: 0.5,
    },
  });
