import { useNavigation } from '@react-navigation/native';
import React, { FC, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BasicButton } from '../components/BasicButton';
import { useGlobalState } from '../components/GlobalState';
import { Input } from '../components/Input';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Sound, useSound } from '../components/Sound';
import { colors } from '../styles/colors';
import Icon from 'react-native-vector-icons/Entypo';
import { ScrollView } from 'react-native-gesture-handler';

const PLAYERS_MIN = 2;

export const HomeScreen: FC = () => {
  const navigation = useNavigation();
  const [newPlayerInput, setNewPlayerInput] = useState('');
  const { playSound } = useSound();
  const {
    players,
    addPlayer,
    removePlayer,
    removeAllPlayers,
    resetScores,
  } = useGlobalState();
  const styles = getStyles(!!newPlayerInput);

  const newPlayer = () => {
    const cleanedName = newPlayerInput.trim();
    setNewPlayerInput('');
    if (!cleanedName) return;
    playSound(Sound.CLICK);
    addPlayer(cleanedName);
  };

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.startButton}>
        <BasicButton
          text="Lancer la partie"
          icon="arrow-bold-right"
          IconElem={Icon}
          disabled={players.length < PLAYERS_MIN}
          onPress={() => {
            playSound(Sound.CLICK);
            resetScores();
            navigation.navigate('SwitchPlayer');
          }}
        />
        {players.length < PLAYERS_MIN && (
          <Text style={styles.playersMin}>{PLAYERS_MIN} joueurs requis</Text>
        )}
      </View>

      {!!players.length && (
        <View style={styles.playersNumberClear}>
          <Text style={styles.playersNumber}>
            {players.length} joueur{players.length > 1 ? 's' : ''}
          </Text>
          <Pressable
            style={styles.clearButton}
            onPress={() => {
              playSound(Sound.CLICK);
              removeAllPlayers();
            }}
          >
            <Icon name="cross" size={30} color={colors.white} />
            <Text style={styles.clearButtonText}>Tout retirer</Text>
          </Pressable>
        </View>
      )}
      <ScrollView alwaysBounceVertical={false}>
        <View style={styles.players}>
          {players.map(({ id, name }) => (
            <View style={styles.player} key={id}>
              <Text style={styles.playerName}>{name}</Text>
              <Pressable
                style={styles.playerButton}
                onPress={() => {
                  playSound(Sound.CLICK);
                  removePlayer(id);
                }}
              >
                <Icon name="circle-with-cross" size={30} color={colors.white} />
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
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
          <Icon name="circle-with-plus" size={40} color={colors.white} />
        </Pressable>
      </View>
    </ScreenWrapper>
  );
};

const getStyles = (input: boolean) =>
  StyleSheet.create({
    container: {},
    startButton: {
      flexBasis: 250,
      flexShrink: 1,
      justifyContent: 'center',
    },
    playersMin: {
      textAlign: 'center',
      color: colors.white,
      fontSize: 14,
      opacity: 0.5,
      marginTop: 5,
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
  });
