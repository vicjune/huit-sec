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
const FADE_DURATION = 100; // 0.1s

interface OverlayProps {
  text: string;
  bottomText?: string;
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
    closeCallback();
    setTimeout(() => {
      setOverlayProps(null);
    }, FADE_DURATION);
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
      duration: FADE_DURATION,
      easing: Easing.ease,
    }).start();

    const timeout = setTimeout(() => {
      closeOverlay();
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: FADE_DURATION,
        easing: Easing.ease,
      }).start();
    }, duration);

    return () => {
      clearTimeout(timeout);
    };
  }, [fadeAnim, overlayProps, closeOverlay]);

  if (!overlayProps) return null;
  const { style, icon, IconElem, text, bottomText } = overlayProps;

  return (
    <Animated.View style={{ ...styles.wrapper, opacity: fadeAnim, ...style }}>
      <IconElem
        name={icon}
        size={100}
        color={colors.white}
        style={styles.icon}
      />
      <Text style={styles.text}>{text}</Text>
      {bottomText && <Text style={styles.bottomText}>{bottomText}</Text>}
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
      marginTop: 'auto',
      marginBottom: 40,
      opacity: 0.8,
    },
    text: {
      fontSize: 40,
      color: colors.white,
      textAlign: 'center',
      marginBottom: 'auto',
    },
    bottomText: {
      textAlign: 'center',
      fontSize: 80,
      color: colors.white,
      marginBottom: 40,
    },
  });
