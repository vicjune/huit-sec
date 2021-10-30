import React, { FC, useEffect, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { default as FAIcon } from 'react-native-vector-icons/FontAwesome';
import { default as EIcon } from 'react-native-vector-icons/Entypo';
import { default as IonIcon } from 'react-native-vector-icons/Ionicons';
import { BasicButton } from '../components/BasicButton';
import { useModal } from '../contexts/Modal';
import { useOverlay } from '../contexts/Overlay';
import { ScoreModal } from '../components/ScoreModal';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Sound, useSound } from '../utils/useSound';
import { Timer } from '../components/Timer';
import { Verdict } from '../components/Verdict';
import { colors } from '../styles/colors';
import { leadingZeros } from '../utils/leadingZeros';
import { usePreventNavigation } from '../utils/usePreventNavigation';
import { SpecialEventModal } from '../components/SpecialEventModal';
import { useActionMenu } from '../utils/useActions';
import { usePlayers } from '../utils/usePlayers';
import { useGame } from '../utils/useGame';
import { useQuestions } from '../utils/useQuestions';
import {
  SpecialEvent,
  SpecialEventId,
  useSpecialEvent,
} from '../utils/useSpecialEvents';
import { useOnScreenBlur, useOnScreenFocus } from '../utils/useOnScreenFocus';
import { Screen } from '../const/Screen';

const PLAYER_ANSWERING_OVERLAY_DURATION = 2500; // 2.5s
const CHANGE_QUESTION_DISAPPEAR = 1000; // 1s

export const QuestionScreen: FC = () => {
  const navigate = usePreventNavigation();
  const [timerRunning, setTimerRunning] = useState(false);
  const [verdict, setVerdict] = useState(false);
  const [changeQuestionDisplayed, setChangeQuestionDisplayed] = useState(true);
  const { openActionMenu } = useActionMenu();
  const { displayOverlay } = useOverlay();
  const { playSound } = useSound();
  const { playerAnswering, secondaryPlayerAnswering } = usePlayers();
  const { answer } = useGame();
  const { currentQuestion, newQuestion } = useQuestions();
  const { currentEvent } = useSpecialEvent();
  const { openModal } = useModal();
  const styles = getStyles(currentEvent);
  const flashback = currentEvent?.id === SpecialEventId.FLASHBACK;
  const timeout = useRef<any>(null);

  const resetScreen = () => {
    setTimerRunning(false);
    setVerdict(false);
  };

  useOnScreenFocus(() => {
    if (!flashback) {
      newQuestion();
    }
    if (currentEvent) {
      openModal(<SpecialEventModal />);
      playSound(Sound.SURPRISE);
    } else {
      displayOverlay({
        text: `Question pour ${playerAnswering?.name}`,
        icon: 'chatbox-ellipses',
        IconElem: IonIcon,
        duration: PLAYER_ANSWERING_OVERLAY_DURATION,
      });
    }
  });

  useOnScreenBlur(() => {
    resetScreen();
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

  const changeQuestionPressed = () => {
    newQuestion();
    setChangeQuestionDisplayed(false);
    timeout.current = setTimeout(() => {
      setChangeQuestionDisplayed(true);
    }, CHANGE_QUESTION_DISAPPEAR);
  };

  const onAnswer = (winnerId?: string) => {
    const victory = answer(winnerId || null);
    if (victory) {
      navigate(Screen.VICTORY);
    } else {
      navigate(Screen.SWITCH_PLAYER);
    }
  };

  return (
    <>
      <ScreenWrapper style={styles.wrapper}>
        {!timerRunning && !verdict && !flashback && changeQuestionDisplayed && (
          <TouchableOpacity
            onPress={changeQuestionPressed}
            style={styles.changeQuestionButton}
          >
            <Text style={styles.changeQuestionButtonText}>
              Changer de question
            </Text>
          </TouchableOpacity>
        )}
        {(!flashback || verdict) && (
          <View>
            <Text style={styles.questionNbr}>
              #{leadingZeros(currentQuestion?.number)}
            </Text>
            <Text style={styles.questionText}>{currentQuestion?.text}</Text>
          </View>
        )}
        {(currentEvent || !verdict) && (
          <View style={styles.eventAndPlayerAnswering}>
            {currentEvent && (
              <Pressable
                style={({ pressed }) => [
                  styles.eventButton,
                  pressed && styles.eventButtonPressed,
                ]}
                onPress={() => openModal(<SpecialEventModal />)}
              >
                {({ pressed }) => (
                  <>
                    <currentEvent.iconType
                      name={currentEvent.icon}
                      size={20}
                      color={pressed ? colors.background : currentEvent.color}
                    />
                    <Text
                      style={[
                        styles.eventTitle,
                        pressed && styles.eventTitlePressed,
                      ]}
                    >
                      {currentEvent.title}
                    </Text>
                  </>
                )}
              </Pressable>
            )}
            {!verdict && currentEvent?.id !== SpecialEventId.EVERYONE && (
              <View style={styles.playerAnswering}>
                {!secondaryPlayerAnswering && (
                  <>
                    <Text style={styles.playerAnsweringLabel}>
                      Question pour
                    </Text>
                    <FAIcon
                      name="arrow-right"
                      size={20}
                      color={colors.white}
                      style={styles.playerAnsweringIcon}
                    />
                  </>
                )}
                <Text style={styles.playerAnsweringName}>
                  {playerAnswering?.name}
                </Text>
                {secondaryPlayerAnswering && (
                  <>
                    <Text style={styles.playerAnsweringVersusLabel}>VS</Text>
                    <Text style={styles.playerAnsweringName}>
                      {secondaryPlayerAnswering.name}
                    </Text>
                  </>
                )}
              </View>
            )}
          </View>
        )}
        <View style={styles.mainAction}>
          {verdict ? (
            <Verdict onAnswer={onAnswer} />
          ) : (
            <Timer
              onComplete={() => setVerdict(true)}
              timerRunning={timerRunning}
              setTimerRunning={setTimerRunning}
            />
          )}
        </View>
        <View style={styles.resetButton}>
          {(timerRunning || verdict) && (
            <BasicButton
              onPress={() => {
                playSound(Sound.CLICK);
                resetScreen();
              }}
              small
              icon="undo"
              IconElem={FAIcon}
            />
          )}
        </View>
        <BasicButton
          small
          style={styles.menuButton}
          icon="menu"
          IconElem={EIcon}
          onPress={menuButtonPressed}
          color={colors.white}
        />
      </ScreenWrapper>
    </>
  );
};

const getStyles = (currentEvent?: SpecialEvent) =>
  StyleSheet.create({
    wrapper: {
      paddingTop: 40,
      paddingLeft: 30,
      paddingRight: 30,
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
      flex: 2,
      justifyContent: 'center',
      marginBottom: 20,
    },
    menuButton: {
      opacity: 0.5,
      position: 'absolute',
      bottom: 20,
      left: 20,
      borderWidth: 0,
    },
    eventAndPlayerAnswering: {
      flex: 1,
      justifyContent: 'center',
      marginTop: 20,
    },
    playerAnswering: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        currentEvent?.id === SpecialEventId.DUEL ? 'center' : 'space-between',
    },
    playerAnsweringLabel: {
      opacity: 0.7,
      color: colors.white,
      fontSize: 18,
    },
    playerAnsweringIcon: {
      opacity: 0.7,
      marginRight: 10,
      marginLeft: 10,
    },
    playerAnsweringVersusLabel: {
      opacity: 0.5,
      color: colors.white,
      fontSize: 18,
      marginRight: 20,
      marginLeft: 20,
    },
    playerAnsweringName: {
      opacity: 0.7,
      color: colors.white,
      fontSize: 30,
    },
    resetButton: {
      marginBottom: 20,
      flexBasis: 60,
      flexShrink: 0,
      justifyContent: 'flex-end',
    },
    eventButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: currentEvent?.color,
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 20,
      paddingRight: 20,
      alignSelf: 'center',
      borderRadius: 10,
    },
    eventButtonPressed: {
      backgroundColor: currentEvent?.color,
    },
    eventTitle: {
      fontSize: 18,
      color: currentEvent?.color,
      marginLeft: 10,
    },
    eventTitlePressed: {
      color: colors.background,
    },
    changeQuestionButton: {
      position: 'absolute',
      top: Platform.OS === 'android' ? 10 : 0,
      right: 10,
    },
    changeQuestionButtonText: {
      color: colors.white,
      opacity: 0.6,
      fontSize: 18,
    },
  });
