import React, { FC } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BasicButton } from '../components/BasicButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useGlobalQuestions } from '../utils/globalState/questions';
import Icon from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { Sound, useSound } from '../contexts/Sound';
import { Screen } from '../const/Screen';
import { colors } from '../styles/colors';
import { pluralize } from '../utils/pluralize';
import { useInAppPurchases } from '../utils/useInAppPurchases';

export const BundlesScreen: FC = () => {
  const { bundlesWithInfos } = useGlobalQuestions();
  const navigation = useNavigation();
  const { playSound } = useSound();
  const totalQuestionsNotSeen = bundlesWithInfos.reduce(
    (prev, { questionsNotSeenNbr, locked }) =>
      locked ? prev : prev + questionsNotSeenNbr,
    0,
  );
  const { purchase, purchaseLoading, productsLoading, loadProducts } =
    useInAppPurchases();
  const styles = getStyles(
    totalQuestionsNotSeen,
    purchaseLoading || productsLoading,
  );

  return (
    <ScreenWrapper style={styles.wrapper}>
      <View style={styles.bundlesWrapper}>
        <ScrollView
          alwaysBounceVertical={false}
          contentContainerStyle={styles.bundles}
          refreshControl={
            <RefreshControl
              refreshing={productsLoading}
              onRefresh={loadProducts}
            />
          }
        >
          {bundlesWithInfos.map((bundle) => (
            <View
              style={[styles.bundle, bundle.locked && styles.bundleLocked]}
              key={bundle.id}
            >
              <View style={styles.iconAndInfos}>
                <View style={styles.infos}>
                  <Text style={styles.bundleTitle}>{bundle.title}</Text>
                  <View style={styles.questionsNbrWrapper}>
                    {!bundle.locked && !bundle.questionsNotSeenNbr && (
                      <Icon
                        name="warning"
                        color={colors.white}
                        size={15}
                        style={styles.questionNbrIcon}
                      />
                    )}
                    <Text style={styles.questionsNbr}>
                      {bundle.locked
                        ? `${bundle.questionsNbr} ${pluralize(
                            'question',
                            bundle.questionsNbr,
                          )}`
                        : bundle.questionsNotSeenNbr
                        ? `${bundle.questionsNotSeenNbr} non-${pluralize(
                            'vue',
                            bundle.questionsNotSeenNbr,
                          )} / ${bundle.questionsNbr}`
                        : `T'as vu les ${bundle.questionsNbr}`}
                    </Text>
                  </View>
                  {bundle.locked ? (
                    <Pressable
                      style={({ pressed }) => [
                        styles.unlockButton,
                        pressed && styles.unlockButtonPressed,
                      ]}
                      disabled={purchaseLoading || productsLoading}
                      onPress={() => {
                        purchase(bundle.id);
                      }}
                    >
                      {({ pressed }) => (
                        <>
                          <Icon
                            name="lock-open"
                            size={20}
                            color={pressed ? colors.background : colors.yellow}
                          />
                          <Text
                            style={[
                              styles.buttonText,
                              pressed && styles.buttonTextPressed,
                            ]}
                          >
                            {bundle.price}
                          </Text>
                        </>
                      )}
                    </Pressable>
                  ) : (
                    <View style={styles.selected}>
                      <Icon
                        name="check"
                        size={20}
                        color={colors.yellow}
                        style={styles.selectedIcon}
                      />
                      <Text style={styles.selectedText}>Sélectionnées</Text>
                    </View>
                  )}
                </View>
                <bundle.iconType
                  name={bundle.icon}
                  color={bundle.locked ? colors.white : colors.yellow}
                  size={35}
                  style={styles.icon}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.totalNotSeen}>
        {!totalQuestionsNotSeen && (
          <Icon
            name="warning"
            color={colors.yellow}
            size={25}
            style={styles.totalNotSeenIcon}
          />
        )}
        <Text style={styles.totalNotSeenText}>
          {totalQuestionsNotSeen
            ? `Encore ${totalQuestionsNotSeen} ${pluralize(
                'question',
                totalQuestionsNotSeen,
              )} jamais ${pluralize('vue', totalQuestionsNotSeen)} !`
            : 'Toutes les questions sélectionnées ont déjà été vues'}
        </Text>
      </View>
      <BasicButton
        text="Lancer"
        icon="arrow-bold-right"
        IconElem={Icon}
        disabled={purchaseLoading}
        onPress={() => {
          playSound(Sound.CLICK);
          navigation.navigate(Screen.SWITCH_PLAYER);
        }}
      />
      {purchaseLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.white} />
        </View>
      )}
    </ScreenWrapper>
  );
};

const getStyles = (totalQuestionsNotSeen: number, loading: boolean) =>
  StyleSheet.create({
    wrapper: {
      paddingTop: 60,
      paddingBottom: 20,
    },
    bundlesWrapper: {
      borderColor: colors.border,
      borderStyle: 'solid',
      borderBottomWidth: 1,
      flexShrink: 1,
    },
    bundles: {
      paddingLeft: 20,
      paddingRight: 20,
    },
    bundle: {
      opacity: loading ? 0.3 : 1,
      backgroundColor: colors.bundleBackground,
      borderRadius: 6,
      marginBottom: 20,
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 13,
      paddingRight: 13,
      borderColor: colors.yellow,
      borderStyle: 'solid',
      borderWidth: 2,
    },
    bundleLocked: {
      backgroundColor: colors.bundleBackground,
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 15,
      paddingRight: 15,
      borderWidth: 0,
    },
    iconAndInfos: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      opacity: 0.8,
      marginRight: 20,
    },
    infos: {
      marginRight: 15,
      flex: 1,
    },
    bundleTitle: {
      color: colors.white,
      fontSize: 18,
      marginBottom: 5,
      flexShrink: 1,
      fontWeight: '600',
    },
    questionsNbrWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    questionNbrIcon: {
      marginRight: 5,
      opacity: 0.7,
    },
    questionsNbr: {
      color: colors.white,
      opacity: 0.8,
    },
    totalNotSeen: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: totalQuestionsNotSeen ? 'center' : 'flex-start',
      paddingLeft: 20,
      paddingRight: 20,
      marginBottom: 30,
      marginTop: 20,
      opacity: loading ? 0.3 : 1,
    },
    totalNotSeenIcon: {
      marginRight: 20,
    },
    totalNotSeenText: {
      color: colors.yellow,
      fontSize: 20,
      flexShrink: 1,
      textAlign: totalQuestionsNotSeen ? 'center' : 'left',
    },
    unlockButton: {
      borderColor: colors.yellow,
      borderStyle: 'solid',
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 15,
      paddingRight: 15,
      borderRadius: 6,
      alignSelf: 'flex-start',
      marginTop: 20,
    },
    unlockButtonPressed: {
      backgroundColor: colors.yellow,
    },
    buttonText: {
      color: colors.yellow,
      marginLeft: 10,
      fontWeight: '600',
      fontSize: 16,
    },
    buttonTextPressed: {
      color: colors.background,
    },
    selected: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    selectedIcon: {
      opacity: 0.8,
    },
    selectedText: {
      marginLeft: 10,
      fontSize: 16,
      color: colors.yellow,
    },
    loader: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
