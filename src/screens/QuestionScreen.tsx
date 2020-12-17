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

  return (
    <ScreenWrapper style={styles.wrapper}>
      <View>
        <Text style={styles.questionNbr}>
          #{leadingZeros(question?.number)}
        </Text>
        <Text style={styles.mainText}>{question?.text}</Text>
      </View>
      <BasicButton
        text="Prochain joueur"
        onPress={() => navigate('SwitchPlayer')}
        size="small"
      />
      <BasicButton
        text="modal"
        onPress={() =>
          showActionSheetWithOptions(
            {
              options: ['Passer la question', 'Quitter'],
              cancelButtonIndex: 2,
              destructiveButtonIndex: 1,
            },
            (buttonIndex) => {
              switch (buttonIndex) {
                case 0:
                  setQuestion(getRandomQuestion());
                  break;
                case 1:
                  navigate('Home');
                  break;
              }
            },
          )
        }
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
  },
  questionNbr: {
    color: colors.text,
    fontSize: 18,
    opacity: 0.5,
  },
});
