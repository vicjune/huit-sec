import { useNavigation } from '@react-navigation/native';
import React, { FC, useState } from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
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
import { usePlayers } from '../utils/usePlayers';
import { useGame } from '../utils/useGame';
import { Screen } from '../const/Screen';
import { pluralize } from '../utils/pluralize';
import { useAppRating } from '../utils/useAppRating';

const PLAYERS_MIN = 2;

export const HomeScreen: FC = () => {
  const navigation = useNavigation();
  const [newPlayerInput, setNewPlayerInput] = useState('');
  const { playSound } = useSound();
  const { openModal } = useModal();
  const { players, addPlayer, removePlayer, removeAllPlayers } = usePlayers();
  const styles = getStyles(!!newPlayerInput);
  const { resetGame, isFirstGame } = useGame();

  const newPlayer = () => {
    const cleanedName = newPlayerInput.trim();
    setNewPlayerInput('');
    if (!cleanedName) return;
    addPlayer(cleanedName);
  };

  const { open } = useAppRating();

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
                isFirstGame ? Screen.TUTORIAL : Screen.BUNDLES,
              );
              open();
            }}
          />
        ) : (
          <Image
            style={[styles.logoButton, styles.logo]}
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            source={require('../images/logo.png')}
          />
        )}
      </View>

      <View style={styles.playersWrapper}>
        {!!players.length && (
          <View style={styles.playersNumberClear}>
            <Text style={styles.playersNumber}>
              {players.length} {pluralize('joueur', players.length)}
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

        {players.length < PLAYERS_MIN && (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>
              {!players.length
                ? 'Commence par ajouter des joueurs'
                : `${PLAYERS_MIN} ${pluralize('joueur', PLAYERS_MIN)} requis`}
            </Text>
            {!players.length && (
              <Icon
                name="arrow-bold-down"
                size={60}
                color={colors.yellow}
                style={styles.tooltipIcon}
              />
            )}
          </View>
        )}
      </View>

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
        color={colors.white}
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
      flex: 1,
      paddingTop: 50,
      paddingBottom: 20,
    },
    logoButton: {
      marginTop: 'auto',
      marginBottom: 'auto',
    },
    logo: {
      width: '80%',
      height: '80%',
      resizeMode: 'contain',
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
    playersWrapper: {
      flex: 1,
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
      borderColor: colors.yellow,
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
    },
    tooltipIcon: {
      marginTop: 10,
    },
  });
