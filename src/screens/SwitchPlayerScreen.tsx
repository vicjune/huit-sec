import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect, useRef } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Entypo';
import { Screen } from '../App';
import { BasicButton } from '../components/BasicButton';
import { useGlobalState } from '../contexts/GlobalState';
import { useModal } from '../contexts/Modal';
import { ScoreModal } from '../components/ScoreModal';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Sound, useSound } from '../contexts/Sound';
import { colors } from '../styles/colors';
import { usePreventNavigation } from '../utils/usePreventNavigation';
import { useActions } from '../utils/useActions';

const BUTTON_TIMEOUT = 3000; // 3s

export const SwitchPlayerScreen: FC = () => {
  const navigation = useNavigation();
  const navigate = usePreventNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const styles = getStyles();
  const { playSound } = useSound();
  const { newTurn, playerAsking } = useGlobalState();
  const openActions = useActions();
  const { openModal } = useModal();

  useEffect(() => {
    const unsubFocus = navigation.addListener('focus', () => {
      newTurn();
      setTimeout(() => {
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

  const menuButtonPressed = () => {
    openActions([
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
