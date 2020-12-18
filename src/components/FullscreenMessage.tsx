import React, { ElementType, FC, useEffect, useRef } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { colors } from '../styles/colors';
import { default as FAIcon } from 'react-native-vector-icons/FontAwesome';

const SCREEN_DURATION = 1500; // 1.5s

interface FullscreenMessageProps {
  closeScreen?: () => void;
  style?: Record<string, unknown>;
  text?: string;
  icon?: string;
  IconElem?: ElementType;
}

export const FullscreenMessage: FC<FullscreenMessageProps> = ({
  closeScreen,
  style,
  text,
  icon,
  IconElem = FAIcon,
}) => {
  const styles = getStyles();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 100,
      easing: Easing.ease,
    }).start();

    const timeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        easing: Easing.ease,
      }).start(closeScreen);
    }, SCREEN_DURATION);

    return () => {
      clearTimeout(timeout);
    };
  }, [fadeAnim, closeScreen]);

  return (
    <Animated.View style={{ ...styles.wrapper, opacity: fadeAnim, ...style }}>
      {icon && (
        <IconElem
          name={icon}
          size={100}
          color={colors.basicButton}
          style={styles.icon}
        />
      )}
      {text && <Text style={styles.text}>{text}</Text>}
    </Animated.View>
  );
};

const getStyles = () =>
  StyleSheet.create({
    wrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.overlay,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    icon: {
      marginBottom: 40,
      opacity: 0.8,
    },
    text: {
      fontSize: 40,
      color: colors.text,
    },
  });
