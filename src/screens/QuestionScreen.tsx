import { useActionSheet } from '@expo/react-native-action-sheet';
import { useNavigation } from '@react-navigation/native';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { default as FAIcon } from 'react-native-vector-icons/FontAwesome';
import { default as IonIcon } from 'react-native-vector-icons/Ionicons';
import { BasicButton } from '../components/BasicButton';
import { useGlobalState } from '../components/GlobalState';
import { useModal } from '../components/Modal';
import { useOverlay } from '../components/Overlay';
import { ScoreModal } from '../components/ScoreModal';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Sound, useSound } from '../components/Sound';
import { Timer } from '../components/Timer';
import { Verdict } from '../components/Verdict';
import { colors } from '../styles/colors';
import { Question } from '../types/Question';
import { leadingZeros } from '../utils/leadingZeros';
import { useGetRandomQuestion } from '../utils/useGetRandomQuestion';
import { usePreventNavigation } from '../utils/usePreventNavigation';

const PLAYER_ANSWERING_DURATION = 2500; // 2.5s

export const QuestionScreen: FC = () => {
  const navigation = useNavigation();
  const navigate = usePreventNavigation();
  const getRandomQuestion = useGetRandomQuestion();
  const [question, setQuestion] = useState<Question | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [verdict, setVerdict] = useState(false);
  const { showActionSheetWithOptions } = useActionSheet();
  const { displayOverlay } = useOverlay();
  const { playSound } = useSound();
  const { goodAnswer, badAnswer, playerAnswering } = useGlobalState();
  const { openModal } = useModal();

  const resetScreen = useCallback(() => {
    setTimerRunning(false);
    setVerdict(false);
  }, [setVerdict, setTimerRunning]);

  useEffect(() => {
    const unsubFocus = navigation.addListener('focus', () => {
      setQuestion(getRandomQuestion());
      displayOverlay({
        text: `Question pour ${playerAnswering?.name}`,
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
  }, [
    navigation,
    setQuestion,
    getRandomQuestion,
    resetScreen,
    displayOverlay,
    playerAnswering,
  ]);

  const menuButtonPressed = () => {
    showActionSheetWithOptions(
      {
        options: [
          'Quitter',
          'Passer la question',
          'Voir les scores',
          'Annuler',
        ],
        cancelButtonIndex: 3,
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
            setQuestion(getRandomQuestion());
            resetScreen();
            break;
          case 2:
            playSound(Sound.CLICK);
            openModal(<ScoreModal />);
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
            <FAIcon name="arrow-right" size={20} color={colors.white} />
            <Text style={styles.playerAnsweringName}>
              {playerAnswering?.name}
            </Text>
          </View>
        )}
        <View style={styles.mainAction}>
          {verdict ? (
            <Verdict
              onValid={() => {
                goodAnswer();
                navigate('SwitchPlayer');
              }}
              onInvalid={() => {
                badAnswer();
                navigate('SwitchPlayer');
              }}
            />
          ) : (
            <Timer
              onComplete={() => setVerdict(true)}
              timerRunning={timerRunning}
              setTimerRunning={setTimerRunning}
            />
          )}
        </View>
        {(timerRunning || verdict) && (
          <Pressable
            onPress={() => {
              playSound(Sound.CLICK);
              resetScreen();
            }}
            style={({ pressed }) => [
              styles.resetButton,
              pressed && styles.resetButtonPressed,
            ]}
          >
            {({ pressed }) => (
              <FAIcon
                name="undo"
                size={30}
                color={pressed ? colors.background : colors.white}
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
  },
  questionText: {
    color: colors.white,
    fontSize: 28,
  },
  questionNbr: {
    color: colors.white,
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
  playerAnswering: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    opacity: 0.4,
    marginTop: 60,
  },
  playerAnsweringLabel: {
    color: colors.white,
    fontSize: 18,
    marginRight: 10,
  },
  playerAnsweringName: {
    color: colors.white,
    fontSize: 30,
    marginLeft: 10,
  },
  resetButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: 100,
    height: 60,
    width: 60,
    marginBottom: 20,
  },
  resetButtonPressed: {
    backgroundColor: colors.white,
  },
  resetButtonIcon: {
    marginLeft: 1,
  },
});
