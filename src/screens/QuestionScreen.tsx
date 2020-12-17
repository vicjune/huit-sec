import { useActionSheet } from '@expo/react-native-action-sheet';
import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BasicButton } from '../components/BasicButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { colors } from '../styles/colors';
import { Question } from '../types/Question';
import { leadingZeros } from '../utils/leadingZeros';
import { useGetRandomQuestion } from '../utils/useGetRandomQuestion';
import { usePreventNavigation } from '../utils/usePreventNavigation';

export const QuestionScreen: FC = () => {
  const navigation = useNavigation();
  const navigate = usePreventNavigation();
  const getRandomQuestion = useGetRandomQuestion();
  const [question, setQuestion] = useState<Question | null>(null);
  const { showActionSheetWithOptions } = useActionSheet();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setQuestion(getRandomQuestion());
    });

    return unsubscribe;
  }, [navigation, setQuestion, getRandomQuestion]);

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
      <View style={styles.mainAction}>
        <BasicButton
          text="Prochain joueur"
          onPress={() => navigate('SwitchPlayer')}
          size="small"
        />
      </View>
      <BasicButton
        style={styles.menuButton}
        text="menu"
        round
        size="small"
        onPress={menuButtonPressed}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 60,
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
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  menuButtonText: {
    color: colors.text,
  },
});
