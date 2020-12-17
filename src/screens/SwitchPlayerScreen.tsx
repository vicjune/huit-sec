import React, { FC, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { BasicButton } from '../components/BasicButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { colors } from '../styles/colors';
import { usePreventNavigation } from '../utils/usePreventNavigation';

const BUTTON_TIMEOUT = 3000; // 3s

export const SwitchPlayerScreen: FC = () => {
  const navigate = usePreventNavigation();
  const [displayButton, setDisplayButton] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const styles = getStyles();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisplayButton(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
      }).start();
    }, BUTTON_TIMEOUT);
    return () => {
      clearTimeout(timeout);
    };
  }, [fadeAnim]);

  return (
    <ScreenWrapper style={styles.wrapper}>
      <Text style={styles.mainText}>Passez le téléphone au joueur suivant</Text>
      <Animated.View
        style={{
          ...styles.buttonWrapper,
          opacity: fadeAnim,
        }}
      >
        <BasicButton
          disabled={!displayButton}
          text="C'est fait"
          onPress={() => navigate('Question')}
          size="small"
        />
      </Animated.View>
    </ScreenWrapper>
  );
};

const getStyles = () =>
  StyleSheet.create({
    wrapper: {
      paddingLeft: 30,
      paddingRight: 30,
      alignItems: 'center',
      flexDirection: 'column',
      paddingBottom: 40,
    },
    mainText: {
      color: colors.text,
      fontSize: 30,
      textAlign: 'center',
      opacity: 0.5,
      marginTop: 'auto',
      marginBottom: 'auto',
    },
    buttonWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
