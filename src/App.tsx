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
import { GlobalStateProvider } from './contexts/GlobalState';
import { VictoryScreen } from './screens/VictoryScreen';

const Stack = createStackNavigator();

export enum Screen {
  HOME = 'HOME',
  QUESTION = 'QUESTION',
  SWITCH_PLAYER = 'SWITCH_PLAYER',
  VICTORY = 'VICTORY',
}

export const App: FC = () => {
  return (
    <ActionSheetProvider>
      <SoundProvider>
        <ModalProvider>
          <OverlayProvider>
            <GlobalStateProvider>
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
            </GlobalStateProvider>
          </OverlayProvider>
        </ModalProvider>
      </SoundProvider>
    </ActionSheetProvider>
  );
};
