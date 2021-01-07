import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { useGlobalState } from '../contexts/GlobalState';
import { useModal } from '../contexts/Modal';
import { colors } from '../styles/colors';
import { BasicButton } from './BasicButton';

export const SpecialEventModal: FC = () => {
  const styles = getStyles();
  const { closeModal } = useModal();
  const { currentEvent } = useGlobalState();

  return (
    <>
      {currentEvent && (
        <View>
          <Text style={styles.title}>{currentEvent.title}</Text>
        </View>
      )}
      <BasicButton
        icon="cross"
        small
        IconElem={Icon}
        onPress={closeModal}
        style={styles.closeButton}
      />
    </>
  );
};

const getStyles = () =>
  StyleSheet.create({
    title: {
      color: colors.white,
      fontSize: 30,
    },
    closeButton: {
      marginTop: 'auto',
      marginBottom: 20,
    },
  });
