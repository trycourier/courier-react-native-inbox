import { Text, Image, StyleSheet, ScrollView, View } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { usePreferences } from '@trycourier/react-hooks';
import oyster from '../../assets/oyster.png';
import { BOLD, SEMI_BOLD } from '../../constants/fontSize';
import { GRAY, WHITE } from '../../constants/colors';
import Preference from '../../components/Preference/Preference';
import { useBrand } from '../../context/CourierReactNativeProvider';

const OYSTER_IMAGE_SIZE = 54;

const styles = StyleSheet.create({
  scrollViewStyle: {
    backgroundColor: WHITE,
  },
  overAll: {
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: WHITE,
    paddingBottom: 37,
  },
  oysterImageSize: {
    height: OYSTER_IMAGE_SIZE,
    width: OYSTER_IMAGE_SIZE,
  },
  headerTextStyle: {
    marginVertical: 14,
    fontSize: 32,
    marginRight: 77,
    lineHeight: 44,
    fontWeight: BOLD,
  },
  subHeaderStyles: {
    marginRight: 77,
    lineHeight: 16,
    marginBottom: 14,
    color: GRAY,
    fontSize: 12,
  },
  preferenceSavedTimeStyle: {
    fontWeight: SEMI_BOLD,
    marginBottom: 23,
  },
});

function PreferenceScreen() {
  const preferences = usePreferences();
  useEffect(() => {
    preferences.fetchRecipientPreferences();
  }, []);

  const { preferenceTemplates } = useBrand();

  const filteredPreferencesTemplates = useMemo(() => {
    if (preferences?.recipientPreferences?.length > 0) {
      return preferenceTemplates.filter((template) =>
        preferences.recipientPreferences.some(
          (receipentPreferenceTemplate: any) =>
            receipentPreferenceTemplate.templateId === template.templateId
        )
      );
    }
    return [];
  }, [preferenceTemplates, preferences]);

  const showPreferences = () => filteredPreferencesTemplates.length > 0;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.scrollViewStyle}
    >
      <View style={styles.overAll}>
        <Image source={oyster} style={styles.oysterImageSize} />
        <Text style={styles.headerTextStyle}>Notification Preferences</Text>
        <Text style={styles.subHeaderStyles}>
          For the categories listed below, you can choose how you’d like Oyster
          to reach you.
        </Text>
        <Text style={[styles.subHeaderStyles, styles.preferenceSavedTimeStyle]}>
          Preferences last saved on Jun 15 at 3:45pm
        </Text>
        {showPreferences() &&
          filteredPreferencesTemplates.map((template) => (
            <Preference
              key={template.templateId}
              title={template.templateName}
              status={template.defaultStatus}
              subtitle="Be notified if you are invited to a group or event."
              optionsTitle="Customize Delivery Channels"
            />
          ))}
      </View>
    </ScrollView>
  );
}

export default PreferenceScreen;
