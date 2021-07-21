import React, { FC } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { default as FAIcon } from 'react-native-vector-icons/FontAwesome';
import { colors } from '../styles/colors';
import { useOverlay } from '../contexts/Overlay';
import { Sound, useSound } from '../contexts/Sound';
import { ScrollView } from 'react-native-gesture-handler';
import { usePlayers, Player } from '../utils/usePlayers';
import { SpecialEventId, useSpecialEvent } from '../utils/useSpecialEvents';
import { INVALID_POINTS, VALID_POINTS } from '../utils/useScore';

interface VerdictProps {
  onAnswer: (winnerId?: string) => void;
}

export const Verdict: FC<VerdictProps> = ({ onAnswer }) => {
  const styles = getStyles();
  const { displayOverlay } = useOverlay();
  const { playSound } = useSound();
  const { playerAnswering, players, playerAsking, secondaryPlayerAnswering } =
    usePlayers();
  const { currentEvent } = useSpecialEvent();
  const basicVerdict =
    !currentEvent ||
    ![SpecialEventId.DUEL, SpecialEventId.EVERYONE].includes(currentEvent.id);

  if (basicVerdict) {
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
              onAnswer();
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
              onAnswer(playerAnswering?.id);
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
  }

  let playerList: Player[] = [];
  if (currentEvent?.id === SpecialEventId.EVERYONE) {
    playerList = players.filter(({ id }) => id !== playerAsking?.id);
  }

  if (
    currentEvent?.id === SpecialEventId.DUEL &&
    playerAnswering &&
    secondaryPlayerAnswering
  ) {
    playerList = [playerAnswering, secondaryPlayerAnswering];
  }

  return (
    <>
      <Text style={styles.verdictText}>Qui a le mieux répondu ?</Text>
      <ScrollView
        contentContainerStyle={styles.playerList}
        alwaysBounceVertical={false}
      >
        {playerList.map(({ id, name }) => (
          <Pressable
            key={id}
            onPress={async () => {
              playSound(Sound.CORRECT);
              await displayOverlay({
                text: `Bien joué ${name}!`,
                bottomText: `+${VALID_POINTS}`,
                icon: 'check',
                IconElem: FAIcon,
                style: styles.validScreen,
              });
              onAnswer(id);
            }}
            style={({ pressed }) => [
              styles.playerButton,
              pressed && styles.playerButtonPressed,
            ]}
          >
            {({ pressed }) => (
              <Text
                style={[
                  styles.playerButtonText,
                  pressed && styles.playerButtonTextPressed,
                ]}
              >
                {name}
              </Text>
            )}
          </Pressable>
        ))}
      </ScrollView>
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
      opacity: 0.6,
      color: colors.white,
      marginBottom: 20,
    },
    validScreen: {
      backgroundColor: colors.overlayValid,
    },
    invalidScreen: {
      backgroundColor: colors.overlayInvalid,
    },
    playerList: {
      justifyContent: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    playerButton: {
      margin: 8,
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 20,
      paddingRight: 20,
      borderWidth: 1,
      borderColor: colors.white,
      borderRadius: 10,
    },
    playerButtonPressed: {
      backgroundColor: colors.white,
    },
    playerButtonText: {
      color: colors.white,
      fontSize: 30,
      maxWidth: 200,
    },
    playerButtonTextPressed: {
      color: colors.background,
    },
  });
