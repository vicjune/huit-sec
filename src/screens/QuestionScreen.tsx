import { useActionSheet } from '@expo/react-native-action-sheet';
import { useNavigation } from '@react-navigation/native';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { default as EIcon } from 'react-native-vector-icons/Entypo';
import { default as FAIcon } from 'react-native-vector-icons/FontAwesome';
import { default as IonIcon } from 'react-native-vector-icons/Ionicons';
import { BasicButton } from '../components/BasicButton';
import { useOverlay } from '../components/Overlay';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { colors } from '../styles/colors';
import { Question } from '../types/Question';
import { leadingZeros } from '../utils/leadingZeros';
import { useGetRandomQuestion } from '../utils/useGetRandomQuestion';
import { usePreventNavigation } from '../utils/usePreventNavigation';

const DEFAULT_TIMER = 8000; // 8s
const INTERVAL = 1000; // 1s
const PLAYER_ANSWERING_DURATION = 2500; // 2.5s

export const QuestionScreen: FC = () => {
  const navigation = useNavigation();
  const navigate = usePreventNavigation();
  const getRandomQuestion = useGetRandomQuestion();
  const [question, setQuestion] = useState<Question | null>(null);
  const [timer, setTimer] = useState<number>(DEFAULT_TIMER);
  const [timerRunning, setTimerRunning] = useState(false);
  const [intervalRef, setIntervalRef] = useState<any>(null);
  const [verdict, setVerdict] = useState(false);
  const { showActionSheetWithOptions } = useActionSheet();
  const { displayOverlay } = useOverlay();

  const startTimer = useCallback(() => {
    setTimerRunning(true);
    const interval = setInterval(() => {
      setTimer((prev) => prev - INTERVAL);
    }, INTERVAL);
    setIntervalRef(interval);
  }, [setTimerRunning, setTimer, setIntervalRef]);

  const resetTimer = useCallback(() => {
    clearInterval(intervalRef);
    setTimerRunning(false);
    setTimer(DEFAULT_TIMER);
  }, [setTimerRunning, setTimer, intervalRef]);

  const resetScreen = useCallback(() => {
    resetTimer();
    setVerdict(false);
  }, [setVerdict, resetTimer]);

  useEffect(() => {
    if (timer <= 0) {
      displayOverlay({
        text: 'Temps écoulé!',
        icon: 'stopwatch',
        IconElem: EIcon,
      }).then(() => setVerdict(true));
      resetTimer();
    }
  }, [timer, displayOverlay, resetTimer]);

  useEffect(() => {
    const unsubFocus = navigation.addListener('focus', () => {
      setQuestion(getRandomQuestion());
      displayOverlay({
        text: 'Question pour Sophie',
        icon: 'chatbox-ellipses',
        IconElem: IonIcon,
        duration: PLAYER_ANSWERING_DURATION,
      });
    });

    const unsubBlur = navigation.addListener('blur', () => {
      resetScreen();
    });

    return () => {
      unsubFocus();
      unsubBlur();
    };
  }, [navigation, setQuestion, getRandomQuestion, resetScreen, displayOverlay]);

  const menuButtonPressed = () => {
    showActionSheetWithOptions(
      {
        options: ['Quitter', 'Passer la question', 'Annuler'],
        cancelButtonIndex: 2,
        destructiveButtonIndex: 0,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            navigate('Home');
            break;
          case 1:
            setQuestion(getRandomQuestion());
            resetScreen();
            break;
        }
      },
    );
  };

  return (
    <>
      <ScreenWrapper style={styles.wrapper}>
        <View>
          <Text style={styles.questionNbr}>
            #{leadingZeros(question?.number)}
          </Text>
          <Text style={styles.questionText}>{question?.text}</Text>
        </View>
        {!verdict && (
          <View style={styles.playerAnswering}>
            <Text style={styles.playerAnsweringLabel}>Pose la question à</Text>
            <FAIcon name="arrow-right" size={20} color={colors.basicButton} />
            <Text style={styles.playerAnsweringName}>Sophie</Text>
          </View>
        )}
        <View style={styles.mainAction}>
          {timerRunning && (
            <Text style={styles.timer}>{Math.floor(timer / 1000)}</Text>
          )}
          {!timerRunning && !verdict && (
            <>
              <Pressable
                onPress={startTimer}
                style={({ pressed }) => [
                  styles.timerButton,
                  pressed && styles.timerButtonPressed,
                ]}
              >
                {({ pressed }) => (
                  <EIcon
                    name="controller-play"
                    size={60}
                    color={pressed ? colors.background : colors.basicButton}
                    style={styles.timerButtonIcon}
                  />
                )}
              </Pressable>
              <Text style={styles.timerButtonText}>
                {DEFAULT_TIMER / 1000}s
              </Text>
            </>
          )}
          {verdict && (
            <>
              <Text style={styles.verdictText}>
                Tu valides la réponse de Sophie ?
              </Text>
              <View style={styles.verdict}>
                <Pressable
                  onPress={async () => {
                    await displayOverlay({
                      text: "C'est refusé!",
                      icon: 'times',
                      IconElem: FAIcon,
                      style: styles.invalidScreen,
                    });
                    navigate('SwitchPlayer');
                  }}
                  style={({ pressed }) => [
                    styles.verdictButton,
                    styles.verdictButtonInvalid,
                    pressed && styles.verdictButtonInvalidPressed,
                  ]}
                >
                  {({ pressed }) => (
                    <>
                      <FAIcon
                        name="times"
                        size={70}
                        color={pressed ? colors.background : colors.invalid}
                      />
                    </>
                  )}
                </Pressable>
                <Pressable
                  onPress={async () => {
                    await displayOverlay({
                      text: "C'est validé!",
                      icon: 'check',
                      IconElem: FAIcon,
                      style: styles.validScreen,
                    });
                    navigate('SwitchPlayer');
                  }}
                  style={({ pressed }) => [
                    styles.verdictButton,
                    styles.verdictButtonValid,
                    pressed && styles.verdictButtonValidPressed,
                  ]}
                >
                  {({ pressed }) => (
                    <>
                      <FAIcon
                        name="check"
                        size={70}
                        color={pressed ? colors.background : colors.valid}
                      />
                    </>
                  )}
                </Pressable>
              </View>
            </>
          )}
        </View>
        {(timerRunning || verdict) && (
          <Pressable
            onPress={resetScreen}
            style={({ pressed }) => [
              styles.resetButton,
              pressed && styles.resetButtonPressed,
            ]}
          >
            {({ pressed }) => (
              <FAIcon
                name="undo"
                size={30}
                color={pressed ? colors.background : colors.basicButton}
                style={styles.resetButtonIcon}
              />
            )}
          </Pressable>
        )}
        <BasicButton
          style={styles.menuButton}
          icon="bars"
          onPress={menuButtonPressed}
        />
      </ScreenWrapper>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 40,
    paddingBottom: 20,
  },
  questionText: {
    color: colors.text,
    fontSize: 28,
  },
  questionNbr: {
    color: colors.text,
    fontSize: 16,
    opacity: 0.5,
  },
  mainAction: {
    marginBottom: 'auto',
    marginTop: 'auto',
  },
  menuButton: {
    opacity: 0.5,
    position: 'absolute',
    bottom: 20,
    left: 20,
    borderWidth: 0,
    borderRadius: 100,
  },
  menuButtonText: {
    color: colors.text,
  },
  playerAnswering: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    opacity: 0.4,
    marginTop: 60,
  },
  playerAnsweringLabel: {
    color: colors.text,
    fontSize: 18,
  },
  playerAnsweringName: {
    color: colors.text,
    fontSize: 30,
  },
  timerButton: {
    alignSelf: 'center',
    height: 100,
    width: 100,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: colors.basicButton,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
  },
  timerButtonPressed: {
    backgroundColor: colors.basicButton,
  },
  timerButtonIcon: {
    marginLeft: 5,
  },
  timerButtonText: {
    fontSize: 40,
    color: colors.text,
    alignSelf: 'center',
    opacity: 0.5,
    marginTop: 10,
  },
  timer: {
    alignSelf: 'center',
    fontSize: 160,
    color: colors.text,
  },
  resetButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.basicButton,
    borderWidth: 1,
    borderRadius: 100,
    height: 60,
    width: 60,
  },
  resetButtonPressed: {
    backgroundColor: colors.basicButton,
  },
  resetButtonIcon: {
    marginLeft: 1,
  },
  verdict: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  verdictButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    width: 120,
    borderRadius: 120,
    borderWidth: 5,
  },
  verdictButtonValid: {
    borderColor: colors.valid,
  },
  verdictButtonInvalid: {
    borderColor: colors.invalid,
  },
  verdictButtonValidPressed: {
    backgroundColor: colors.valid,
  },
  verdictButtonInvalidPressed: {
    backgroundColor: colors.invalid,
  },
  verdictText: {
    textAlign: 'center',
    fontSize: 25,
    opacity: 0.5,
    color: colors.text,
    marginBottom: 20,
  },
  validScreen: {
    backgroundColor: colors.overlayValid,
  },
  invalidScreen: {
    backgroundColor: colors.overlayInvalid,
  },
});
