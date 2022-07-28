import { StyleSheet, View, FlatList } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { usePreferences } from '@trycourier/react-hooks';
import Preference from '../../components/Preference/Preference';
import { useBrand } from '../../context/CourierReactNativeProvider';

const normalizeSelectedOption = (str: String) => {
  return str
    .split('_')
    .map((subStr) => {
      if (subStr.length === 1) return subStr.toUpperCase();
      return subStr[0].toUpperCase() + subStr.slice(1).toLowerCase();
    })
    .join(' ');
};

const styles = StyleSheet.create({
  overAll: {
    flex: 1,
    marginTop: 4,
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

  if (showPreferences() === false) return null;
  return (
    <View style={styles.overAll}>
      <FlatList
        data={filteredPreferencesTemplates}
        renderItem={({ item: template }) => (
          <View style={styles.preferenceContainer}>
            <Preference
              title={template.templateName}
              status={template.defaultStatus}
              subtitle={normalizeSelectedOption(template.defaultStatus)}
              optionsTitle="Customize Delivery Channels"
            />
          </View>
        )}
        keyExtractor={({ templateId }) => templateId}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default PreferenceScreen;
