import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { BasicButton } from '../components/BasicButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { colors } from '../styles/colors';
import { Question } from '../types/Question';
import { useGetRandomQuestion } from '../utils/useGetRandomQuestion';
import { usePreventNavigation } from '../utils/usePreventNavigation';

export const QuestionScreen: FC = () => {
  const navigation = useNavigation();
  const navigate = usePreventNavigation();
  const getRandomQuestion = useGetRandomQuestion();
  const [question, setQuestion] = useState<Question | null>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setQuestion(getRandomQuestion());
    });

    return unsubscribe;
  }, [navigation, setQuestion, getRandomQuestion]);

  return (
    <ScreenWrapper style={styles.wrapper}>
      <Text style={styles.mainText}>{question?.text}</Text>
      <BasicButton
        text="Prochain joueur"
        onPress={() => navigate('SwitchPlayer')}
        size="small"
      />
      <BasicButton
        text="Passer la question"
        onPress={() => setQuestion(getRandomQuestion())}
        size="small"
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 60,
    paddingBottom: 40,
  },
  mainText: {
    color: colors.text,
    fontSize: 26,
    textAlign: 'center',
  },
});
