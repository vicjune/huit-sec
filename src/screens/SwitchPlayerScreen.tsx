import React, { FC } from 'react';
import { StyleSheet, Text } from 'react-native';
import { BasicButton } from '../components/BasicButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { colors } from '../styles/colors';
import { usePreventNavigation } from '../utils/usePreventNavigation';

interface SwitchPlayerScreenProps {}

export const SwitchPlayerScreen: FC<SwitchPlayerScreenProps> = ({}) => {
  const navigate = usePreventNavigation();

  return (
    <ScreenWrapper style={styles.wrapper}>
      <Text style={styles.mainText}>Passez le téléphone au joueur suivant</Text>
      <BasicButton
        text="Aller à la question"
        onPress={() => navigate('Question')}
        size="small"
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'space-around',
    paddingLeft: 30,
    paddingRight: 30,
  },
  mainText: {
    color: colors.text,
    fontSize: 30,
    textAlign: 'center',
  },
});
