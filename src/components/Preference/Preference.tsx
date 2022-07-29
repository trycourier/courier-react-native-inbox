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
import type {
  RecipientPreferenceType,
  SelectedOptionType,
  UpdateSelectedOptionsType,
} from './types';

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

const allOptions: SelectedOptionType[] = ['Email', 'Push'];

const getUpdatedArray = ({
  option,
  currentSelectedOptions,
}: {
  option: SelectedOptionType;
  currentSelectedOptions: SelectedOptionType[];
}): SelectedOptionType[] => {
  const idx = currentSelectedOptions.findIndex(
    (selectedOption) => selectedOption === option
  );
  if (idx === -1) return [...currentSelectedOptions, option];
  return [
    ...currentSelectedOptions.slice(0, idx),
    ...currentSelectedOptions.slice(idx + 1),
  ];
};

const rgbToRgbaConverter = ({
  rgb,
  opacity = 1,
}: {
  rgb: string;
  opacity?: number;
}) => {
  const rgbaReplace = rgb.replace('rgb', 'rgba');
  const opacityAddedValue = `${rgbaReplace.slice(
    0,
    rgbaReplace.length - 1
  )},${opacity})`;
  return opacityAddedValue;
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
    .map((subStr) => {
      if (subStr.length === 1) return subStr.toUpperCase();
      return subStr[0].toUpperCase() + subStr.slice(1).toLowerCase();
    })
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

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionType[]>([
    'Email',
    'Push',
  ]);
  const {
    colors: { primary },
  } = useBrand();

  const { updateRecipientPreferences } = usePreferences();

  const updateSelectedOptions: UpdateSelectedOptionsType = (
    option: SelectedOptionType
  ) => {
    const updatedArray = getUpdatedArray({
      option,
      currentSelectedOptions: selectedOptions,
    });
    setSelectedOptions([...updatedArray]);
  };

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

  const resetSelectedOptions = () => {
    setSelectedOptions(allOptions);
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
            options={allOptions}
            selectedOptions={selectedOptions}
            updateSelectedOptions={updateSelectedOptions}
            resetSelectedOptions={resetSelectedOptions}
          />
        </View>
      )}
    </View>
  );
}

export default Preference;
