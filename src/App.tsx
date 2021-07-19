import React, { FC, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './screens/HomeScreen';
import { QuestionScreen } from './screens/QuestionScreen';
import { colors } from './styles/colors';
import { SwitchPlayerScreen } from './screens/SwitchPlayerScreen';
import { ModalProvider } from './contexts/Modal';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { OverlayProvider } from './contexts/Overlay';
import { SoundProvider } from './contexts/Sound';
import { VictoryScreen } from './screens/VictoryScreen';
import { GlobalStateProvider } from './contexts/GlobalState';
import { Screen } from './const/Screen';
import { BundlesScreen } from './screens/BundlesScreen';
import { InAppPurchasesProvider } from './contexts/InAppPurchases';
import { bundles } from './const/bundles';
import { TutorialScreen } from './screens/TutorialScreen';
import SplashScreen from 'react-native-splash-screen';

const Stack = createStackNavigator();

export const App: FC = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const productIds = bundles
    .filter(({ lockedByDefault }) => lockedByDefault)
    .map(({ id }) => id);

  return (
    <GlobalStateProvider>
      <ActionSheetProvider>
        <InAppPurchasesProvider productIds={productIds}>
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
                      name={Screen.TUTORIAL}
                      component={TutorialScreen}
                      options={{
                        headerTitle: 'Comment jouer ?',
                        headerBackTitle: 'Retour',
                        headerTintColor: colors.white,
                        headerTransparent: true,
                      }}
                    />
                    <Stack.Screen
                      name={Screen.BUNDLES}
                      component={BundlesScreen}
                      options={{
                        headerTitle: 'Questions',
                        headerBackTitle: 'Retour',
                        headerTintColor: colors.white,
                        headerTransparent: true,
                      }}
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
                </NavigationContainer>
              </OverlayProvider>
            </ModalProvider>
          </SoundProvider>
        </InAppPurchasesProvider>
      </ActionSheetProvider>
    </GlobalStateProvider>
  );
};
