import { usePreferences } from '@trycourier/react-hooks';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import {
  DIVIDER_COLOR,
  GRAY,
  LIGHT_GRAY,
  PREFERENCE_SWITCH_INACTIVE_COLOR,
  WHITE,
} from '../../constants/colors';
import { FONT_MEDIUM, FONT_SMALL, SEMI_BOLD } from '../../constants/fontSize';
import { useBrand } from '../../context/CourierReactNativeProvider';
import CustomizeOptions from './CustomizeOptions';
import type {
  PreferencesTemplateType,
  PreferencesStatusType,
} from '../../context/Brands/brands.types';
import type { RecipientPreferenceType } from './types';
import { rgbToRgbaConverter, capitalize } from '../../utils/helper';

const styles = StyleSheet.create({
  overAll: {
    borderColor: DIVIDER_COLOR,
    borderTopWidth: 1,
    backgroundColor: LIGHT_GRAY,
    padding: 12,
    borderRadius: 4,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleStyle: {
    fontSize: FONT_MEDIUM,
    fontWeight: SEMI_BOLD,
  },
  subTitleStyle: {
    fontSize: FONT_SMALL,
    lineHeight: 16,
    maxWidth: 260,
    color: GRAY,
  },
  customizationOptionContainerStyles: {
    marginTop: 14,
  },
});

type Props = {
  preferenceTemplate: PreferencesTemplateType;
  recipientPreference: RecipientPreferenceType;
  optionsTitle: string;
  startPreferenceLoading: () => void;
  stopPreferenceLoading: () => void;
};

const preferenceSwitchInactiveColorConverter = (
  color: string,
  status: PreferencesStatusType
) => {
  const trackColorOpacity = status === 'REQUIRED' ? 0.15 : 0.35;
  return rgbToRgbaConverter({ rgb: color, opacity: trackColorOpacity });
};

const getThumbColor = (color: string, status: PreferencesStatusType) => {
  const trackColorOpacity = status === 'REQUIRED' ? 0.7 : 1;
  return rgbToRgbaConverter({ rgb: color, opacity: trackColorOpacity });
};

const normalizeSelectedOption = (str: String) => {
  return str
    .split('_')
    .map((subStr) => capitalize(subStr))
    .join(' ');
};

function Preference({
  preferenceTemplate,
  recipientPreference,
  optionsTitle,
  startPreferenceLoading,
  stopPreferenceLoading,
}: Props) {
  const { templateName: title, templateId } = preferenceTemplate;
  const status = recipientPreference.status || preferenceTemplate.defaultStatus;
  const [isEnabled, setIsEnabled] = useState(
    status === 'OPTED_IN' || status === 'REQUIRED'
  );

  const {
    colors: { primary },
  } = useBrand();

  const { updateRecipientPreferences } = usePreferences();

  const handleOnPreferenceChange = (
    newPreferences: RecipientPreferenceType
  ): Promise<any> => {
    return updateRecipientPreferences({
      ...newPreferences,
      templateId,
    });
  };

  const onToggleStatusChange = (value: boolean) => {
    startPreferenceLoading();
    const toggledValue = value ? 'OPTED_IN' : 'OPTED_OUT';
    handleOnPreferenceChange({
      ...recipientPreference,
      status: toggledValue,
    })
      .then(() => {
        setIsEnabled((prev) => !prev);
      })
      .finally(stopPreferenceLoading);
  };

  return (
    <View style={styles.overAll}>
      <View style={styles.container}>
        <View>
          <Text style={styles.titleStyle}>{title}</Text>
          <Text style={styles.subTitleStyle}>
            {normalizeSelectedOption(status)}
          </Text>
        </View>
        <Switch
          disabled={status === 'REQUIRED'}
          value={isEnabled}
          trackColor={{
            true: preferenceSwitchInactiveColorConverter(primary, status),
            false: PREFERENCE_SWITCH_INACTIVE_COLOR,
          }}
          thumbColor={isEnabled ? getThumbColor(primary, status) : WHITE}
          ios_backgroundColor={WHITE}
          onValueChange={onToggleStatusChange}
        />
      </View>
      {isEnabled && (
        <View style={styles.customizationOptionContainerStyles}>
          <CustomizeOptions
            title={optionsTitle}
            recipientPreference={recipientPreference}
            handlePreferenceChange={handleOnPreferenceChange}
          />
        </View>
      )}
    </View>
  );
}

export default Preference;
