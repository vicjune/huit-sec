import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BasicButton } from '../components/BasicButton';
import { useGlobalState } from '../components/GlobalState';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Sound, useSound } from '../components/Sound';
import { colors } from '../styles/colors';
import { usePreventNavigation } from '../utils/usePreventNavigation';

const BUTTON_TIMEOUT = 3000; // 3s

export const SwitchPlayerScreen: FC = () => {
  const navigation = useNavigation();
  const navigate = usePreventNavigation();
  const [displayButton, setDisplayButton] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const styles = getStyles();
  const { playSound } = useSound();
  const { newTurn, playerAsking } = useGlobalState();

  useEffect(() => {
    const unsubFocus = navigation.addListener('focus', () => {
      newTurn();
      setTimeout(() => {
        setDisplayButton(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.ease,
        }).start();
      }, BUTTON_TIMEOUT);
    });

    const unsubBlur = navigation.addListener('blur', () => {
      fadeAnim.setValue(0);
    });

    return () => {
      unsubFocus();
      unsubBlur();
    };
  }, [navigation, fadeAnim, newTurn]);

  return (
    <ScreenWrapper style={styles.wrapper}>
      <Icon name="forward" size={60} color={colors.white} style={styles.icon} />
      <Text style={styles.label}>Passe le téléphone à</Text>
      <Text style={styles.name}>{playerAsking?.name}</Text>
      <Animated.View
        style={{
          ...styles.buttonWrapper,
          opacity: fadeAnim,
        }}
      >
        <BasicButton
          disabled={!displayButton}
          text="C'est fait"
          icon="check"
          onPress={() => {
            playSound(Sound.CLICK);
            navigate('Question');
          }}
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
    },
    icon: {
      marginTop: 'auto',
      marginBottom: 50,
      opacity: 0.8,
    },
    label: {
      color: colors.white,
      fontSize: 30,
      textAlign: 'center',
      marginBottom: 10,
      opacity: 0.8,
    },
    name: {
      color: colors.white,
      fontSize: 40,
      textAlign: 'center',
      marginBottom: 'auto',
    },
    buttonWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 40,
    },
  });
