import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { colors } from '../styles/colors';
import Icon from 'react-native-vector-icons/Entypo';
import { BasicButton } from './BasicButton';
import { getRank } from '../utils/getRank';
import { useModal } from '../contexts/Modal';
import { ScreenWrapper } from './ScreenWrapper';
import { usePlayers } from '../utils/usePlayers';

export const ScoreModal: FC = () => {
  const styles = getStyles();
  const { players } = usePlayers();
  const { closeModal } = useModal();

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Scores</Text>
      <ScrollView alwaysBounceVertical={false} style={styles.players}>
        {sortedPlayers.map(({ id, name, score }, i) => {
          const rank = getRank(i, sortedPlayers);
          return (
            <View style={styles.player} key={id}>
              <Text
                style={[
                  styles.rank,
                  rank === '1er' && styles.rankFirst,
                  rank === '2e' && styles.rankSecond,
                  rank === '3e' && styles.rankThird,
                ]}
              >
                {rank}
              </Text>
              <Text style={styles.playerName}>{name}</Text>
              <Text style={styles.score}>{score}</Text>
            </View>
          );
        })}
      </ScrollView>
      <BasicButton
        icon="cross"
        small
        IconElem={Icon}
        onPress={closeModal}
        style={styles.closeButton}
      />
    </ScreenWrapper>
  );
};

const getStyles = () =>
  StyleSheet.create({
    title: {
      marginTop: 20,
      marginBottom: 20,
      marginLeft: 30,
      color: colors.yellow,
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
    rankFirst: {
      color: colors.first,
      textShadowColor: colors.firstShadow,
      textShadowRadius: 10,
      opacity: 1,
    },
    rankSecond: {
      color: colors.second,
      textShadowColor: colors.secondShadow,
      textShadowRadius: 10,
      opacity: 1,
    },
    rankThird: {
      color: colors.third,
      textShadowColor: colors.thirdShadow,
      textShadowRadius: 10,
      opacity: 1,
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
      marginBottom: 20,
    },
  });
