import React, { FC } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './screens/HomeScreen';
import { QuestionScreen } from './screens/QuestionScreen';
import { colors } from './styles/colors';
import { SwitchPlayerScreen } from './screens/SwitchPlayerScreen';
import { Modal, ModalProvider } from './components/Modal';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Overlay, OverlayProvider } from './components/Overlay';
import { SoundProvider } from './components/Sound';

const Stack = createStackNavigator();

export const App: FC = () => {
  return (
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
                  name="Home"
                  component={HomeScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Question"
                  component={QuestionScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="SwitchPlayer"
                  component={SwitchPlayerScreen}
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
  );
};
