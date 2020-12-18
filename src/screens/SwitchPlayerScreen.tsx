import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BasicButton } from '../components/BasicButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { colors } from '../styles/colors';
import { usePreventNavigation } from '../utils/usePreventNavigation';

const BUTTON_TIMEOUT = 3000; // 3s

export const SwitchPlayerScreen: FC = () => {
  const navigation = useNavigation();
  const navigate = usePreventNavigation();
  const [displayButton, setDisplayButton] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const styles = getStyles();

  useEffect(() => {
    const unsubFocus = navigation.addListener('focus', () => {
      setTimeout(() => {
        setDisplayButton(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.ease,
        }).start();
      }, BUTTON_TIMEOUT);
    });

    const unsubBlur = navigation.addListener('blur', () => {
      fadeAnim.setValue(0);
    });

    return () => {
      unsubFocus();
      unsubBlur();
    };
  }, [navigation, fadeAnim]);

  return (
    <ScreenWrapper style={styles.wrapper}>
      <Icon
        name="forward"
        size={60}
        color={colors.basicButton}
        style={styles.icon}
      />
      <Text style={styles.label}>Passe le téléphone à</Text>
      <Text style={styles.name}>Victor</Text>
      <Animated.View
        style={{
          ...styles.buttonWrapper,
          opacity: fadeAnim,
        }}
      >
        <BasicButton
          disabled={!displayButton}
          text="C'est fait"
          icon="check"
          onPress={() => navigate('Question')}
          size="small"
        />
      </Animated.View>
    </ScreenWrapper>
  );
};

const getStyles = () =>
  StyleSheet.create({
    wrapper: {
      paddingLeft: 30,
      paddingRight: 30,
      alignItems: 'center',
      flexDirection: 'column',
      paddingBottom: 40,
    },
    icon: {
      marginTop: 'auto',
      marginBottom: 50,
      opacity: 0.8,
    },
    label: {
      color: colors.text,
      fontSize: 30,
      textAlign: 'center',
      marginBottom: 10,
      opacity: 0.8,
    },
    name: {
      color: colors.text,
      fontSize: 40,
      textAlign: 'center',
      marginBottom: 'auto',
    },
    buttonWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
