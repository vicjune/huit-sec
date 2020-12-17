import React, { FC } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './screens/HomeScreen';
import { QuestionScreen } from './screens/QuestionScreen';
import { colors } from './styles/colors';
import { SwitchPlayerScreen } from './screens/SwitchPlayerScreen';
import { PopinDisplay, PopinProvider } from './components/Popin';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

const Stack = createStackNavigator();

export const App: FC = () => {
  return (
    <ActionSheetProvider>
      <PopinProvider>
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
          <PopinDisplay />
        </NavigationContainer>
      </PopinProvider>
    </ActionSheetProvider>
  );
};
