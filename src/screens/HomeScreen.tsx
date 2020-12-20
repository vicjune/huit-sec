import { useNavigation } from '@react-navigation/native';
import React, { FC, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BasicButton } from '../components/BasicButton';
import { useGlobalState } from '../components/GlobalState';
import { Input } from '../components/Input';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Sound, useSound } from '../components/Sound';
import { colors } from '../styles/colors';
import Icon from 'react-native-vector-icons/Entypo';

export const HomeScreen: FC = () => {
  const navigation = useNavigation();
  const [newPlayerInput, setNewPlayerInput] = useState('');
  const { playSound } = useSound();
  const { players, addPlayer, removePlayer } = useGlobalState();
  const styles = getStyles(!!newPlayerInput);

  const newPlayer = () => {
    if (!newPlayerInput) return;
    playSound(Sound.CLICK);
    addPlayer(newPlayerInput);
    setNewPlayerInput('');
  };

  return (
    <ScreenWrapper style={styles.container}>
      <BasicButton
        text="Lancer la partie"
        disabled={players.length < 2}
        onPress={() => {
          playSound(Sound.CLICK);
          navigation.navigate('SwitchPlayer');
        }}
      />
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
    container: {
      paddingTop: 40,
      alignItems: 'center',
    },
    inputWrapper: {
      marginTop: 'auto',
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
