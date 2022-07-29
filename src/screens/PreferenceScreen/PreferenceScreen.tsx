import { usePreferences } from '@trycourier/react-hooks';
import React, { useState, useEffect, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { FullScreenIndicator } from '../../components/FullScreenIndicator';
import Preference from '../../components/Preference/Preference';
import type { RecipientPreferenceType } from '../../components/Preference/types';
import { DIVIDER_COLOR } from '../../constants/colors';
import type { PreferencesTemplateType } from '../../context/Brands/brands.types';
import { useBrand } from '../../context/CourierReactNativeProvider';

const styles = StyleSheet.create({
  overAll: {
    flex: 1,
    marginTop: 4,
    position: 'relative',
  },
  fullScreenIndicatorContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: DIVIDER_COLOR,
  },

  preferenceContainer: {
    marginBottom: 4,
  },
});

function PreferenceScreen() {
  const preferences = usePreferences();
  useEffect(() => {
    preferences.fetchRecipientPreferences();
  }, []);
  const [isPreferenceLoading, setIsPreferenceLoading] = useState(false);
  const startPreferenceLoading = () => setIsPreferenceLoading(true);
  const stopPreferenceLoading = () => setIsPreferenceLoading(false);

  const { preferenceTemplates } = useBrand();

  const filteredPreferencesTemplates = useMemo(() => {
    if (preferences?.recipientPreferences?.length > 0) {
      return preferenceTemplates
        .map((preferenceTemplate) => {
          const selectedRecipientPreference: RecipientPreferenceType =
            preferences.recipientPreferences.find(
              (recipientPreference: RecipientPreferenceType) =>
                preferenceTemplate.templateId === recipientPreference.templateId
            );
          if (selectedRecipientPreference) {
            return {
              preferenceTemplate,
              recipientPreference: selectedRecipientPreference,
            };
          }
          return null;
        })
        .filter((val) => val) as {
        preferenceTemplate: PreferencesTemplateType;
        recipientPreference: RecipientPreferenceType;
      }[];
    }

    return [];
  }, [preferenceTemplates, preferences]);

  const showPreferences = () => filteredPreferencesTemplates.length > 0;

  if (showPreferences() === false) return null;
  return (
    <View style={styles.overAll}>
      {isPreferenceLoading && (
        <View style={styles.fullScreenIndicatorContainer}>
          <FullScreenIndicator />
        </View>
      )}
      <FlatList
        data={filteredPreferencesTemplates}
        renderItem={({ item: { preferenceTemplate, recipientPreference } }) => (
          <View style={styles.preferenceContainer}>
            <Preference
              preferenceTemplate={preferenceTemplate}
              recipientPreference={recipientPreference}
              optionsTitle="Customize Delivery Channels"
              startPreferenceLoading={startPreferenceLoading}
              stopPreferenceLoading={stopPreferenceLoading}
            />
          </View>
        )}
        keyExtractor={({ preferenceTemplate: { templateId } }) => templateId}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default PreferenceScreen;
