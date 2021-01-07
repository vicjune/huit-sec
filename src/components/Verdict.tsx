import React, { FC } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { default as FAIcon } from 'react-native-vector-icons/FontAwesome';
import { colors } from '../styles/colors';
import { useGlobalState } from '../contexts/GlobalState';
import { useOverlay } from '../contexts/Overlay';
import { Sound, useSound } from '../contexts/Sound';
import { INVALID_POINTS, VALID_POINTS } from '../utils/scores';

interface VerdictProps {
  onValid: () => void;
  onInvalid: () => void;
}

export const Verdict: FC<VerdictProps> = ({ onValid, onInvalid }) => {
  const styles = getStyles();
  const { displayOverlay } = useOverlay();
  const { playSound } = useSound();
  const { playerAnswering } = useGlobalState();

  return (
    <>
      <Text style={styles.verdictText}>
        Tu valides la réponse de {playerAnswering?.name} ?
      </Text>
      <View style={styles.verdict}>
        <Pressable
          onPress={async () => {
            playSound(Sound.WRONG);
            await displayOverlay({
              text: "C'est refusé!",
              bottomText: INVALID_POINTS.toString(),
              icon: 'times',
              IconElem: FAIcon,
              style: styles.invalidScreen,
            });
            onInvalid();
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
            playSound(Sound.CORRECT);
            await displayOverlay({
              text: "C'est validé!",
              bottomText: `+${VALID_POINTS}`,
              icon: 'check',
              IconElem: FAIcon,
              style: styles.validScreen,
            });
            onValid();
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
  );
};

const getStyles = () =>
  StyleSheet.create({
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
      color: colors.white,
      marginBottom: 20,
    },
    validScreen: {
      backgroundColor: colors.overlayValid,
    },
    invalidScreen: {
      backgroundColor: colors.overlayInvalid,
    },
  });
