import React, { FC, useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, Vibration } from 'react-native';
import { default as EIcon } from 'react-native-vector-icons/Entypo';
import { colors } from '../styles/colors';
import { useOverlay } from '../contexts/Overlay';
import { useSound, Sound } from '../contexts/Sound';
import { useGlobalState } from '../contexts/GlobalState';

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
  const { timerValue } = useGlobalState();
  const [timer, setTimer] = useState<number>(timerValue);
  const [intervalRef, setIntervalRef] = useState<any>(null);
  const { displayOverlay } = useOverlay();
  const { playSound } = useSound();

  useEffect(() => {
    if (!timerRunning) {
      clearInterval(intervalRef);
      setTimer(timerValue);
    }
  }, [setIntervalRef, timerRunning, setTimer, intervalRef, timerValue]);

  useEffect(() => {
    if (timer <= 0) {
      playSound(Sound.TIMEUP);
      Vibration.vibrate();

      displayOverlay({
        text: 'Temps écoulé!',
        icon: 'stopwatch',
        IconElem: EIcon,
      }).then(onComplete);
      setTimerRunning(false);
    }
  }, [timer, displayOverlay, setTimerRunning, onComplete, playSound]);

  const startTimer = useCallback(() => {
    playSound(Sound.BLIP);
    setTimerRunning(true);
    const interval = setInterval(() => {
      setTimer((prev) => {
        const newTimer = prev - INTERVAL;
        if (newTimer > 0) playSound(Sound.TICK);
        return newTimer;
      });
    }, INTERVAL);
    setIntervalRef(interval);
  }, [setTimerRunning, setTimer, setIntervalRef, playSound]);

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
            color={pressed ? colors.background : colors.white}
            style={styles.timerButtonIcon}
          />
        )}
      </Pressable>
      <Text style={styles.timerButtonText}>{timerValue / 1000}s</Text>
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
      borderColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0.8,
    },
    timerButtonPressed: {
      backgroundColor: colors.white,
    },
    timerButtonIcon: {
      marginLeft: 5,
    },
    timerButtonText: {
      fontSize: 40,
      color: colors.white,
      alignSelf: 'center',
      opacity: 0.5,
      marginTop: 10,
    },
    timer: {
      alignSelf: 'center',
      fontSize: 160,
      color: colors.white,
    },
  });
