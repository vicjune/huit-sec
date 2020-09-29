import React, { FC } from 'react';
import { BasicButton } from '../components/BasicButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { usePreventNavigation } from '../utils/usePreventNavigation';

export const QuestionScreen: FC = () => {
  const navigate = usePreventNavigation();

  return (
    <ScreenWrapper>
      <BasicButton text="Back" onPress={() => navigate('Home')} />
    </ScreenWrapper>
  );
};
