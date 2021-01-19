import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { default as EntIcon } from 'react-native-vector-icons/Entypo';
import { useGlobalState } from '../contexts/GlobalState';
import { useModal } from '../contexts/Modal';
import { colors } from '../styles/colors';
import { SpecialEvent } from '../utils/specialEvents';
import { BasicButton } from './BasicButton';
import { ScreenWrapper } from './ScreenWrapper';

export const SpecialEventModal: FC = () => {
  const {
    currentEvent,
    playerAnswering,
    secondaryPlayerAnswering,
  } = useGlobalState();
  const styles = getStyles(currentEvent);
  const { closeModal } = useModal();

  if (!currentEvent) return null;

  return (
    <ScreenWrapper
      wrapperStyle={styles.screenWrapperWrapper}
      style={styles.screenWrapper}
    >
      <View>
        <currentEvent.iconType
          name={currentEvent.icon}
          size={100}
          color={colors.white}
          style={styles.icon}
        />
        <Text style={styles.title}>{currentEvent.title}</Text>
      </View>
      <Text style={styles.description}>{currentEvent.description}</Text>
      {playerAnswering && (
        <View style={styles.playerAnswering}>
          {!secondaryPlayerAnswering && (
            <Text style={styles.playerAnsweringLabel}>Question pour</Text>
          )}
          <Text style={styles.playerAnsweringName}>{playerAnswering.name}</Text>
          {secondaryPlayerAnswering && (
            <>
              <Text style={styles.playerAnsweringVersusLabel}>VS</Text>
              <Text style={styles.playerAnsweringName}>
                {secondaryPlayerAnswering.name}
              </Text>
            </>
          )}
        </View>
      )}

      <BasicButton
        icon="check"
        small
        IconElem={EntIcon}
        onPress={closeModal}
        style={styles.closeButton}
      />
    </ScreenWrapper>
  );
};

const getStyles = (currentEvent?: SpecialEvent) =>
  StyleSheet.create({
    screenWrapperWrapper: {
      backgroundColor: currentEvent?.backgroundColor,
    },
    screenWrapper: {
      justifyContent: 'space-between',
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 40,
    },
    icon: {
      opacity: 0.3,
      alignSelf: 'center',
    },
    title: {
      color: colors.white,
      fontSize: 40,
      opacity: 0.5,
      marginTop: 10,
      textAlign: 'center',
    },
    playerAnswering: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    playerAnsweringVersusLabel: {
      color: colors.white,
      fontSize: 20,
      opacity: 0.8,
      marginLeft: 20,
      marginRight: 20,
    },
    playerAnsweringLabel: {
      color: colors.white,
      fontSize: 30,
      marginRight: 10,
      marginLeft: 10,
      opacity: 0.5,
    },
    playerAnsweringName: {
      color: colors.white,
      fontSize: 40,
    },
    description: {
      color: colors.white,
      fontSize: 25,
      textAlign: 'center',
    },
    closeButton: {
      marginBottom: 20,
      backgroundColor: currentEvent?.backgroundColor,
    },
  });
