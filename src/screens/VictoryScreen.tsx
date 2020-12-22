import React, { FC, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BasicButton } from '../components/BasicButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import Icon from 'react-native-vector-icons/Entypo';
import { default as FAIcon } from 'react-native-vector-icons/FontAwesome5';
import { Sound, useSound } from '../components/Sound';
import { usePreventNavigation } from '../utils/usePreventNavigation';
import { Screen } from '../App';
import { useModal } from '../components/Modal';
import { ScoreModal } from '../components/ScoreModal';
import { useGlobalState } from '../components/GlobalState';
import { colors } from '../styles/colors';
import { useNavigation } from '@react-navigation/native';

export const VictoryScreen: FC = () => {
  const styles = getStyles();
  const navigation = useNavigation();
  const navigate = usePreventNavigation();
  const { playSound } = useSound();
  const { openModal } = useModal();
  const { players } = useGlobalState();

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
    <ScreenWrapper style={styles.wrapper}>
      <View style={styles.winner}>
        <Text style={styles.winnerLabel}>C'est gagné!</Text>
        <FAIcon
          style={styles.winnerIcon}
          name="crown"
          size={80}
          color={colors.white}
        />
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
    wrapper: {},
    winner: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    winnerName: {
      color: colors.white,
      fontSize: 40,
      textAlign: 'center',
      marginTop: 20,
    },
    winnerIcon: {
      opacity: 0.3,
    },
    winnerLabel: {
      marginBottom: 40,
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
