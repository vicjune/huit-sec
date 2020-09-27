import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';

export const HomeScreen: FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.wrapper}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.buttonText}>Nouvelle partie</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};
