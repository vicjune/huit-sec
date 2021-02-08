import React, { FC, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BasicButton } from '../components/BasicButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import Icon from 'react-native-vector-icons/Entypo';
import { default as FAIcon } from 'react-native-vector-icons/FontAwesome5';
import { Sound, useSound } from '../contexts/Sound';
import { usePreventNavigation } from '../utils/usePreventNavigation';
import { Screen } from '../App';
import { useModal } from '../contexts/Modal';
import { ScoreModal } from '../components/ScoreModal';
import { colors } from '../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { useGlobalPlayers } from '../utils/globalState/players';

export const VictoryScreen: FC = () => {
  const styles = getStyles();
  const navigation = useNavigation();
  const navigate = usePreventNavigation();
  const { playSound } = useSound();
  const { openModal } = useModal();
  const { players } = useGlobalPlayers();

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const [winner] = sortedPlayers;

  useEffect(() => {
    const unsubFocus = navigation.addListener('focus', () => {
      playSound(Sound.VICTORY);
    });

    return () => {
      unsubFocus();
    };
  }, [navigation, playSound]);

  return (
    <ScreenWrapper>
      <View style={styles.winner}>
        <Text style={styles.winnerLabel}>C'est gagné!</Text>
        <FAIcon name="crown" size={80} color={colors.first} />
        <Text style={styles.winnerName}>{winner?.name}</Text>
      </View>
      <BasicButton
        icon="list"
        IconElem={Icon}
        text="Scores"
        onPress={() => {
          openModal(<ScoreModal />);
        }}
        style={styles.scoreButton}
      />
      <BasicButton
        icon="home"
        small
        IconElem={Icon}
        onPress={() => {
          navigate(Screen.HOME);
        }}
        style={styles.homeButton}
      />
    </ScreenWrapper>
  );
};

const getStyles = () =>
  StyleSheet.create({
    winner: {
      alignItems: 'center',
      flex: 1,
    },
    winnerName: {
      color: colors.white,
      fontSize: 40,
      textAlign: 'center',
      marginTop: 10,
      marginBottom: 'auto',
    },
    winnerLabel: {
      marginTop: 40,
      marginBottom: 'auto',
      opacity: 0.6,
      color: colors.white,
      fontSize: 50,
      textAlign: 'center',
    },
    scoreButton: {
      marginTop: 'auto',
    },
    homeButton: {
      marginTop: 40,
      marginBottom: 40,
    },
  });
