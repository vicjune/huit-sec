import { useActionSheet } from '@expo/react-native-action-sheet';
import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BasicButton } from '../components/BasicButton';
import { useGlobalState } from '../components/GlobalState';
import { useModal } from '../components/Modal';
import { ScoreModal } from '../components/ScoreModal';
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
  const { showActionSheetWithOptions } = useActionSheet();
  const { openModal } = useModal();

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

  const menuButtonPressed = () => {
    showActionSheetWithOptions(
      {
        options: ['Quitter', 'Voir les scores', 'Annuler'],
        cancelButtonIndex: 2,
        destructiveButtonIndex: 0,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            playSound(Sound.CLICK);
            navigate('Home');
            break;
          case 1:
            playSound(Sound.CLICK);
            openModal(<ScoreModal />);
        }
      },
    );
  };

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
        {/* <BasicButton
          disabled={!displayButton}
          text="C'est fait"
          icon="check"
          onPress={() => {
            playSound(Sound.CLICK);
            navigate('Question');
          }}
          size="small"
        /> */}
        <Pressable
          disabled={!displayButton}
          onPress={() => {
            playSound(Sound.CLICK);
            navigate('Question');
          }}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          {({ pressed }) => (
            <>
              <Icon
                name="check"
                size={55}
                color={pressed ? colors.background : colors.white}
              />
              <Text
                style={[styles.buttonText, pressed && styles.buttonTextPressed]}
              >
                C'est fait
              </Text>
            </>
          )}
        </Pressable>
      </Animated.View>
      <BasicButton
        style={styles.menuButton}
        icon="bars"
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
      marginBottom: 'auto',
    },
    button: {
      alignSelf: 'center',
      height: 120,
      width: 120,
      borderRadius: 120,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0.8,
      paddingBottom: 5,
    },
    buttonPressed: {
      backgroundColor: colors.white,
    },
    buttonText: {
      fontSize: 16,
      color: colors.white,
      alignSelf: 'center',
    },
    buttonTextPressed: {
      color: colors.background,
    },
    menuButton: {
      opacity: 0.5,
      position: 'absolute',
      bottom: 20,
      left: 20,
      borderWidth: 0,
      borderRadius: 100,
    },
  });
