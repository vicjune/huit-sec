import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { colors } from '../styles/colors';
import { useGlobalState } from './GlobalState';
import { Sound, useSound } from './Sound';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { BasicButton } from './BasicButton';
import { getRank } from '../utils/getRank';
import { useModal } from './Modal';

export const ScoreModal: FC = () => {
  const styles = getStyles();
  const { players } = useGlobalState();
  const { playSound } = useSound();
  const { closeModal } = useModal();

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <>
      <Text style={styles.title}>Scores</Text>
      <ScrollView alwaysBounceVertical={false} style={styles.players}>
        {sortedPlayers.map(({ id, name, score }, i) => (
          <View style={styles.player} key={id}>
            <Text style={styles.rank}>{getRank(i)}</Text>
            <Text style={styles.playerName}>{name}</Text>
            <Text style={styles.score}>{score}</Text>
          </View>
        ))}
      </ScrollView>
      <BasicButton
        text="Retour"
        icon="arrow-left"
        size="small"
        IconElem={Icon}
        onPress={() => {
          playSound(Sound.CLICK);
          closeModal();
        }}
        style={styles.closeButton}
      />
    </>
  );
};

const getStyles = () =>
  StyleSheet.create({
    title: {
      marginTop: 40,
      marginBottom: 40,
      textAlign: 'center',
      color: colors.white,
      fontSize: 40,
    },
    players: {
      borderTopColor: colors.border,
      borderTopWidth: 1,
    },
    player: {
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
      paddingLeft: 20,
      paddingRight: 20,
      paddingBottom: 3,
      paddingTop: 3,
      flexDirection: 'row',
      alignItems: 'center',
    },
    rank: {
      fontSize: 30,
      color: colors.white,
      opacity: 0.5,
      width: 60,
    },
    playerName: {
      fontSize: 20,
      color: colors.white,
    },
    score: {
      fontSize: 40,
      color: colors.white,
      marginLeft: 'auto',
    },
    closeButton: {
      marginTop: 'auto',
      marginBottom: 40,
    },
  });