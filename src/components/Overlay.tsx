import React, {
  createContext,
  ElementType,
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { colors } from '../styles/colors';

const SCREEN_DURATION = 1500; // 1.5s

interface OverlayProps {
  text: string;
  icon: string;
  IconElem: ElementType;
  style?: Record<string, unknown>;
  duration?: number;
}

interface OverlayContext {
  displayOverlay: (props: OverlayProps) => Promise<void>;
  closeOverlay: () => void;
  overlayProps: OverlayProps | null;
}

const overlayContext = createContext<OverlayContext>({
  displayOverlay: () => Promise.resolve(),
  closeOverlay: () => {},
  overlayProps: null,
});

export const OverlayProvider: FC = ({ children }) => {
  const [overlayProps, setOverlayProps] = useState<OverlayProps | null>(null);
  const [closeCallback, setCloseCallback] = useState<() => void>(
    () => () => {},
  );

  const displayOverlay = (props: OverlayProps) => {
    setOverlayProps(props);
    return new Promise<void>((resolve) => {
      setCloseCallback(() => resolve);
    });
  };

  const closeOverlay = () => {
    setOverlayProps(null);
    closeCallback();
  };

  return (
    <overlayContext.Provider
      value={{
        displayOverlay,
        closeOverlay,
        overlayProps,
      }}
    >
      {children}
    </overlayContext.Provider>
  );
};

export const useOverlay = () => {
  const { displayOverlay } = useContext(overlayContext);
  return { displayOverlay };
};

export const Overlay: FC = () => {
  const { overlayProps, closeOverlay } = useContext(overlayContext);
  const styles = getStyles();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!overlayProps) {
      fadeAnim.setValue(0);
      return;
    }

    const { duration = SCREEN_DURATION } = overlayProps;

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
      }).start(closeOverlay);
    }, duration);

    return () => {
      clearTimeout(timeout);
    };
  }, [fadeAnim, overlayProps, closeOverlay]);

  if (!overlayProps) return null;
  const { style, icon, IconElem, text } = overlayProps;

  return (
    <Animated.View style={{ ...styles.wrapper, opacity: fadeAnim, ...style }}>
      <IconElem
        name={icon}
        size={100}
        color={colors.basicButton}
        style={styles.icon}
      />
      <Text style={styles.text}>{text}</Text>
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
      padding: 20,
    },
    icon: {
      marginBottom: 40,
      opacity: 0.8,
    },
    text: {
      fontSize: 40,
      color: colors.text,
      textAlign: 'center',
    },
  });
