import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useNavigation } from '@react-navigation/native';
import { BasicButton } from '../components/BasicButton';
import { default as EntIcon } from 'react-native-vector-icons/Entypo';
import { Sound, useSound } from '../contexts/Sound';
import { Screen } from '../const/Screen';

export const TutorialScreen: FC = () => {
  const navigation = useNavigation();
  const styles = getStyles();
  const { playSound } = useSound();

  return (
    <ScreenWrapper style={styles.wrapper}>
      <View style={styles.imageWrapper}>
        <Image
          style={styles.image}
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          source={require('../images/tutorial.png')}
        />
      </View>
      <BasicButton
        style={styles.button}
        text="Lancer"
        icon="arrow-bold-right"
        IconElem={EntIcon}
        onPress={() => {
          playSound(Sound.CLICK);
          navigation.navigate(Screen.SWITCH_PLAYER);
        }}
      />
    </ScreenWrapper>
  );
};

const getStyles = () =>
  StyleSheet.create({
    wrapper: {
      paddingTop: 60,
      paddingBottom: 20,
    },
    imageWrapper: {
      flex: 1,
      position: 'relative',
    },
    image: {
      height: '100%',
      width: '100%',
      resizeMode: 'contain',
    },
    button: {
      marginTop: 20,
    },
  });
