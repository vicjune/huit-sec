import React, { FC, useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { default as EIcon } from 'react-native-vector-icons/Entypo';
import { colors } from '../styles/colors';
import { useOverlay } from './Overlay';

const DEFAULT_TIMER = 8000; // 8s
const INTERVAL = 1000; // 1s

interface TimerProps {
  timerRunning: boolean;
  setTimerRunning: (timerRunning: boolean) => void;
  onComplete: () => void;
}

export const Timer: FC<TimerProps> = ({
  onComplete,
  timerRunning,
  setTimerRunning,
}) => {
  const styles = getStyles();
  const [timer, setTimer] = useState<number>(DEFAULT_TIMER);
  const [intervalRef, setIntervalRef] = useState<any>(null);
  const { displayOverlay } = useOverlay();

  const startTimer = useCallback(() => {
    setTimerRunning(true);
    const interval = setInterval(() => {
      setTimer((prev) => prev - INTERVAL);
    }, INTERVAL);
    setIntervalRef(interval);
  }, [setTimerRunning, setTimer, setIntervalRef]);

  useEffect(() => {
    if (!timerRunning) {
      clearInterval(intervalRef);
      setTimer(DEFAULT_TIMER);
    }
  }, [setIntervalRef, timerRunning, setTimer, intervalRef]);

  useEffect(() => {
    if (timer <= 0) {
      displayOverlay({
        text: 'Temps écoulé!',
        icon: 'stopwatch',
        IconElem: EIcon,
      }).then(onComplete);
      setTimerRunning(false);
    }
  }, [timer, displayOverlay, setTimerRunning, onComplete]);

  if (timerRunning) {
    return <Text style={styles.timer}>{Math.floor(timer / 1000)}</Text>;
  }

  return (
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
      <Text style={styles.timerButtonText}>{DEFAULT_TIMER / 1000}s</Text>
    </>
  );
};

const getStyles = () =>
  StyleSheet.create({
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
  });
