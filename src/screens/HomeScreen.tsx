import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import { BasicButton } from '../components/BasicButton';
import { Input } from '../components/Input';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Sound, useSound } from '../contexts/Sound';
import { colors } from '../styles/colors';
import Icon from 'react-native-vector-icons/Entypo';
import { default as IonIcon } from 'react-native-vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';
import { useModal } from '../contexts/Modal';
import { SettingsModal } from '../components/SettingsModal';
import { useGlobalPlayers } from '../utils/globalState/players';
import { useGlobalGame } from '../utils/globalState/game';
import { useGlobalQuestions } from '../utils/globalState/questions';
import { useGlobalTimer } from '../utils/globalState/timer';
import { useGlobalScore } from '../utils/globalState/score';
import { Screen } from '../types/Screen';

const PLAYERS_MIN = 2;

export const HomeScreen: FC = () => {
  const navigation = useNavigation();
  const [newPlayerInput, setNewPlayerInput] = useState('');
  const { playSound } = useSound();
  const { openModal } = useModal();
  const { players, addPlayer, removePlayer, removeAllPlayers } =
    useGlobalPlayers();
  const styles = getStyles(!!newPlayerInput);
  const { resetGame, isFirstGame } = useGlobalGame();
  const { initPlayers } = useGlobalPlayers();
  const { initQuestions } = useGlobalQuestions();
  const { initTimer } = useGlobalTimer();
  const { initScore } = useGlobalScore();

  useEffect(() => {
    initPlayers();
    initQuestions();
    initTimer();
    initScore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const newPlayer = () => {
    const cleanedName = newPlayerInput.trim();
    setNewPlayerInput('');
    if (!cleanedName) return;
    addPlayer(cleanedName);
  };

  return (
    <ScreenWrapper>
      <View style={styles.topView}>
        {players.length >= PLAYERS_MIN ? (
          <BasicButton
            style={styles.logoButton}
            text="Lancer"
            icon="arrow-bold-right"
            IconElem={Icon}
            disabled={players.length < PLAYERS_MIN}
            onPress={() => {
              Keyboard.dismiss();
              playSound(Sound.CLICK);
              resetGame();
              navigation.navigate(
                isFirstGame ? Screen.SWITCH_PLAYER : Screen.BUNDLES,
              );
            }}
          />
        ) : (
          <Text style={styles.logoButton}>LOGO</Text>
        )}
        {!!players.length && players.length < PLAYERS_MIN && (
          <Text style={styles.tooltipText}>{PLAYERS_MIN} joueurs requis</Text>
        )}
      </View>

      {!!players.length && (
        <View style={styles.playersNumberClear}>
          <Text style={styles.playersNumber}>
            {players.length} joueur{players.length > 1 ? 's' : ''}
          </Text>
          <Pressable style={styles.clearButton} onPress={removeAllPlayers}>
            <Icon name="cross" size={30} color={colors.white} />
            <Text style={styles.clearButtonText}>Tout retirer</Text>
          </Pressable>
        </View>
      )}
      <ScrollView
        alwaysBounceVertical={false}
        contentContainerStyle={styles.players}
      >
        {players.map(({ id, name }) => (
          <View style={styles.player} key={id}>
            <Text style={styles.playerName}>{name}</Text>
            <Pressable
              style={styles.playerButton}
              onPress={() => {
                removePlayer(id);
              }}
            >
              <Icon
                name="circle-with-cross"
                size={30}
                color={colors.white}
                style={styles.playerIcon}
              />
            </Pressable>
          </View>
        ))}
      </ScrollView>
      {!players.length && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>
            Commence par ajouter des joueurs
          </Text>
          <Icon name="arrow-bold-down" size={60} color={colors.yellow} />
        </View>
      )}
      <View style={styles.inputWrapper}>
        <Input
          style={styles.input}
          value={newPlayerInput}
          onChange={setNewPlayerInput}
          onSubmit={newPlayer}
          placeholder="Ajouter un joueur"
        />
        <Pressable
          style={styles.inputButton}
          onPress={newPlayer}
          disabled={!newPlayerInput}
        >
          <Icon name="circle-with-plus" size={40} color={colors.yellow} />
        </Pressable>
      </View>
      <BasicButton
        small
        icon="settings-sharp"
        IconElem={IonIcon}
        style={styles.settingsButton}
        onPress={() => {
          openModal(<SettingsModal />);
        }}
      />
    </ScreenWrapper>
  );
};

const getStyles = (input: boolean) =>
  StyleSheet.create({
    topView: {
      alignItems: 'center',
      flexBasis: 250,
      flexShrink: 1,
      justifyContent: 'flex-end',
      marginBottom: 20,
    },
    logoButton: {
      marginTop: 'auto',
      marginBottom: 'auto',
    },
    playersMin: {
      textAlign: 'center',
      color: colors.white,
      fontSize: 14,
      opacity: 0.3,
      marginTop: 10,
    },
    playersNumberClear: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: 15,
      paddingRight: 15,
      marginBottom: 15,
    },
    playersNumber: {
      color: colors.white,
      fontSize: 20,
      opacity: 0.5,
    },
    clearButton: {
      alignSelf: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      opacity: 0.8,
    },
    clearButtonText: {
      fontSize: 18,
      color: colors.white,
    },
    players: {
      paddingLeft: 10,
      paddingRight: 10,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    player: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 5,
      borderWidth: 1,
      borderColor: colors.white,
      borderRadius: 20,
      paddingLeft: 10,
    },
    playerName: {
      color: colors.white,
      fontSize: 18,
      marginRight: 5,
      maxWidth: 200,
    },
    playerButton: {
      padding: 3,
    },
    playerIcon: {
      opacity: 0.8,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.inputBackground,
    },
    input: {
      flexShrink: 1,
      flexGrow: 1,
    },
    inputButton: {
      flexShrink: 0,
      paddingRight: 10,
      opacity: input ? 1 : 0.5,
    },
    settingsButton: {
      opacity: 0.5,
      borderWidth: 0,
      position: 'absolute',
      top: 10,
      left: 10,
    },
    tooltip: {
      alignItems: 'center',
      marginLeft: 40,
      marginRight: 40,
      marginBottom: 20,
    },
    tooltipText: {
      color: colors.yellow,
      fontSize: 25,
      textAlign: 'center',
      marginBottom: 10,
    },
  });
