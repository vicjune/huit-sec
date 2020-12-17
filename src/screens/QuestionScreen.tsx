import { useActionSheet } from '@expo/react-native-action-sheet';
import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { BasicButton } from '../components/BasicButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { colors } from '../styles/colors';
import { Question } from '../types/Question';
import { leadingZeros } from '../utils/leadingZeros';
import { useGetRandomQuestion } from '../utils/useGetRandomQuestion';
import { usePreventNavigation } from '../utils/usePreventNavigation';

const ACTION_TIMEOUT = 2000; // 2s

export const QuestionScreen: FC = () => {
  const navigation = useNavigation();
  const navigate = usePreventNavigation();
  const getRandomQuestion = useGetRandomQuestion();
  const [question, setQuestion] = useState<Question | null>(null);
  const { showActionSheetWithOptions } = useActionSheet();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubFocus = navigation.addListener('focus', () => {
      setQuestion(getRandomQuestion());

      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.ease,
        }).start();
      }, ACTION_TIMEOUT);
    });

    const unsubBlur = navigation.addListener('blur', () => {
      fadeAnim.setValue(0);
    });

    return () => {
      unsubFocus();
      unsubBlur();
    };
  }, [navigation, setQuestion, getRandomQuestion, fadeAnim]);

  const menuButtonPressed = () => {
    showActionSheetWithOptions(
      {
        options: ['Quitter', 'Passer la question', 'Annuler'],
        cancelButtonIndex: 2,
        destructiveButtonIndex: 0,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            navigate('Home');
            break;
          case 1:
            setQuestion(getRandomQuestion());
            break;
        }
      },
    );
  };

  return (
    <ScreenWrapper style={styles.wrapper}>
      <View>
        <Text style={styles.questionNbr}>
          #{leadingZeros(question?.number)}
        </Text>
        <Text style={styles.questionText}>{question?.text}</Text>
      </View>
      <Animated.View
        style={{
          ...styles.mainAction,
          opacity: fadeAnim,
        }}
      >
        <BasicButton
          text="Prochain joueur"
          onPress={() => navigate('SwitchPlayer')}
          size="small"
        />
      </Animated.View>
      <BasicButton
        style={styles.menuButton}
        icon="bars"
        onPress={menuButtonPressed}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 70,
    paddingBottom: 40,
  },
  questionText: {
    color: colors.text,
    fontSize: 26,
  },
  questionNbr: {
    color: colors.text,
    fontSize: 18,
    opacity: 0.5,
  },
  mainAction: {
    marginBottom: 'auto',
    marginTop: 'auto',
  },
  menuButton: {
    opacity: 0.5,
    position: 'absolute',
    bottom: 20,
    left: 20,
    borderWidth: 0,
    borderRadius: 100,
  },
  menuButtonText: {
    color: colors.text,
  },
});
