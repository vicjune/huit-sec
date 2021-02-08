import React, { FC } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { colors } from '../styles/colors';
import { BasicButton } from './BasicButton';
import Icon from 'react-native-vector-icons/Entypo';
import { useModal } from '../contexts/Modal';
import { useGlobalState } from '../contexts/GlobalState';
import { ScreenWrapper } from './ScreenWrapper';

const MIN_SCORE_VICTORY = 1;
const MAX_SCORE_VICTORY = 30;

const MIN_TIMER = 5000;
const MAX_TIMER = 15000;

export const SettingsModal: FC = () => {
  const styles = getStyles();
  const { closeModal } = useModal();
  const {
    scoreVictory,
    setScoreVictory,
    timerValue,
    setTimerValue,
  } = useGlobalState();

  const incrementScore = () => {
    if (scoreVictory >= MAX_SCORE_VICTORY) return;
    setScoreVictory(scoreVictory + 1);
  };

  const decrementScore = () => {
    if (scoreVictory <= MIN_SCORE_VICTORY) return;
    setScoreVictory(scoreVictory - 1);
  };

  const incrementTimer = () => {
    if (timerValue >= MAX_TIMER) return;
    setTimerValue(timerValue + 1000);
  };

  const decrementTimer = () => {
    if (timerValue <= MIN_TIMER) return;
    setTimerValue(timerValue - 1000);
  };

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Réglages</Text>
      <ScrollView alwaysBounceVertical={false} style={styles.settings}>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Score pour gagner</Text>
          <View style={styles.settingAction}>
            <Pressable
              disabled={scoreVictory <= MIN_SCORE_VICTORY}
              style={[
                styles.settingButton,
                scoreVictory <= MIN_SCORE_VICTORY &&
                  styles.settingButtonDisabled,
              ]}
              onPress={decrementScore}
            >
              <Icon name="squared-minus" size={35} color={colors.white} />
            </Pressable>
            <Text style={styles.settingValue}>{scoreVictory}</Text>
            <Pressable
              disabled={scoreVictory >= MAX_SCORE_VICTORY}
              style={[
                styles.settingButton,
                scoreVictory >= MAX_SCORE_VICTORY &&
                  styles.settingButtonDisabled,
              ]}
              onPress={incrementScore}
            >
              <Icon name="squared-plus" size={35} color={colors.white} />
            </Pressable>
          </View>
        </View>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Chrono</Text>
          <View style={styles.settingAction}>
            <Pressable
              disabled={timerValue <= MIN_TIMER}
              style={[
                styles.settingButton,
                timerValue <= MIN_TIMER && styles.settingButtonDisabled,
              ]}
              onPress={decrementTimer}
            >
              <Icon name="squared-minus" size={35} color={colors.white} />
            </Pressable>
            <Text style={styles.settingValue}>{timerValue / 1000}s</Text>
            <Pressable
              disabled={timerValue >= MAX_TIMER}
              style={[
                styles.settingButton,
                timerValue >= MAX_TIMER && styles.settingButtonDisabled,
              ]}
              onPress={incrementTimer}
            >
              <Icon name="squared-plus" size={35} color={colors.white} />
            </Pressable>
          </View>
        </View>
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
      color: colors.white,
      fontSize: 40,
    },
    settings: {
      borderTopColor: colors.border,
      borderTopWidth: 1,
    },
    setting: {
      flexDirection: 'row',
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
      alignItems: 'center',
      paddingLeft: 20,
      paddingRight: 10,
      height: 70,
    },
    settingLabel: {
      color: colors.white,
      fontSize: 20,
      opacity: 0.8,
    },
    settingAction: {
      marginLeft: 'auto',
      flexDirection: 'row',
      alignItems: 'center',
    },
    settingButton: {
      paddingLeft: 5,
      paddingRight: 5,
    },
    settingButtonDisabled: {
      opacity: 0.5,
    },
    settingValue: {
      color: colors.white,
      fontSize: 30,
      width: 50,
      textAlign: 'center',
    },
    closeButton: {
      marginTop: 'auto',
      marginBottom: 20,
    },
  });
