import React, { FC } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './screens/HomeScreen';
import { QuestionScreen } from './screens/QuestionScreen';
import { colors } from './styles/colors';
import { SwitchPlayerScreen } from './screens/SwitchPlayerScreen';
import { Modal, ModalProvider } from './contexts/Modal';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Overlay, OverlayProvider } from './contexts/Overlay';
import { SoundProvider } from './contexts/Sound';
import { VictoryScreen } from './screens/VictoryScreen';
import { GlobalStateProvider } from './contexts/GlobalState';

const Stack = createStackNavigator();

export enum Screen {
  HOME = 'HOME',
  QUESTION = 'QUESTION',
  SWITCH_PLAYER = 'SWITCH_PLAYER',
  VICTORY = 'VICTORY',
}

export const App: FC = () => {
  return (
    <GlobalStateProvider>
      <ActionSheetProvider>
        <SoundProvider>
          <ModalProvider>
            <OverlayProvider>
              <NavigationContainer>
                <StatusBar
                  barStyle="light-content"
                  backgroundColor={colors.background}
                />
                <Stack.Navigator>
                  <Stack.Screen
                    name={Screen.HOME}
                    component={HomeScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name={Screen.QUESTION}
                    component={QuestionScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name={Screen.SWITCH_PLAYER}
                    component={SwitchPlayerScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name={Screen.VICTORY}
                    component={VictoryScreen}
                    options={{ headerShown: false }}
                  />
                </Stack.Navigator>
                <Modal />
                <Overlay />
              </NavigationContainer>
            </OverlayProvider>
          </ModalProvider>
        </SoundProvider>
      </ActionSheetProvider>
    </GlobalStateProvider>
  );
};
