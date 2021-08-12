import React, { FC, useRef, useState, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Entypo';
import { BasicButton } from '../components/BasicButton';
import { useModal } from '../contexts/Modal';
import { ScoreModal } from '../components/ScoreModal';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Sound, useSound } from '../utils/useSound';
import { colors } from '../styles/colors';
import { usePreventNavigation } from '../utils/usePreventNavigation';
import { useActionMenu } from '../utils/useActions';
import { usePlayers } from '../utils/usePlayers';
import { useGame } from '../utils/useGame';
import { useOnScreenBlur, useOnScreenFocus } from '../utils/useOnScreenFocus';
import { Screen } from '../const/Screen';

const BUTTON_TIMEOUT = 3000; // 3s

export const SwitchPlayerScreen: FC = () => {
  const navigate = usePreventNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const styles = getStyles();
  const { playSound } = useSound();
  const { playerAsking } = usePlayers();
  const { newTurn } = useGame();
  const { openActionMenu } = useActionMenu();
  const { openModal } = useModal();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const timeout = useRef<any>(null);

  useOnScreenFocus(() => {
    newTurn();
    setButtonDisabled(true);
    timeout.current = setTimeout(() => {
      setButtonDisabled(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
      }).start();
    }, BUTTON_TIMEOUT);
  });

  useOnScreenBlur(() => {
    fadeAnim.setValue(0);
  });

  useEffect(
    () => () => {
      clearTimeout(timeout.current);
    },
    [],
  );

  const menuButtonPressed = () => {
    openActionMenu([
      {
        label: 'Quitter',
        red: true,
        callback: () => {
          navigate(Screen.HOME);
        },
      },
      {
        label: 'Voir les scores',
        callback: () => {
          openModal(<ScoreModal />);
        },
      },
      {
        label: 'Annuler',
        cancel: true,
      },
    ]);
  };

  return (
    <ScreenWrapper style={styles.wrapper}>
      <Icon
        name="forward"
        size={100}
        color={colors.white}
        style={styles.icon}
      />
      <Text style={styles.label}>Passe le téléphone à</Text>
      <Text style={styles.name}>{playerAsking?.name}</Text>
      <Animated.View
        style={{
          ...styles.buttonWrapper,
          opacity: fadeAnim,
        }}
      >
        <BasicButton
          text="C'est fait"
          disabled={buttonDisabled}
          icon="check"
          IconElem={Icon}
          onPress={() => {
            playSound(Sound.CLICK);
            navigate(Screen.QUESTION);
          }}
        />
      </Animated.View>
      <BasicButton
        small
        style={styles.menuButton}
        icon="menu"
        IconElem={Icon}
        onPress={menuButtonPressed}
        color={colors.white}
      />
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
      opacity: 0.3,
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
      marginBottom: 'auto',
    },
    menuButton: {
      opacity: 0.5,
      position: 'absolute',
      bottom: 20,
      left: 20,
      borderWidth: 0,
    },
  });
