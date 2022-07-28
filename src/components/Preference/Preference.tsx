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
import type { PreferencesStatusType } from '../../context/Brands/brands.types';
import { useBrand } from '../../context/CourierReactNativeProvider';
import CustomizeOptions from './CustomizeOptions';
import type { SelectedOptionType, UpdateSelectedOptionsType } from './types';

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
  title: string;
  subtitle: string;
  optionsTitle: string;
  status: PreferencesStatusType;
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
const preferenceSwitchInactiveColorConverter = (color: string) => {
  const trackColorOpacity = 0.35;
  const rgbaReplace = color.replace('rgb', 'rgba');
  const opacityAddedValue = `${rgbaReplace.slice(
    0,
    rgbaReplace.length - 1
  )},${trackColorOpacity})`;
  return opacityAddedValue;
};

function Preference({ title, subtitle, optionsTitle, status }: Props) {
  const isEnabled = status === 'OPTED_IN' || status === 'REQUIRED';
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionType[]>([
    'Email',
    'Push',
  ]);
  const {
    colors: { primary },
  } = useBrand();

  const updateSelectedOptions: UpdateSelectedOptionsType = (
    option: SelectedOptionType
  ) => {
    const updatedArray = getUpdatedArray({
      option,
      currentSelectedOptions: selectedOptions,
    });
    setSelectedOptions([...updatedArray]);
  };

  const resetSelectedOptions = () => {
    setSelectedOptions(allOptions);
  };

  return (
    <View style={styles.overAll}>
      <View style={styles.container}>
        <View>
          <Text style={styles.titleStyle}>{title}</Text>
          <Text style={styles.subTitleStyle}>{subtitle}</Text>
        </View>
        <Switch
          disabled={status === 'REQUIRED'}
          value={isEnabled}
          trackColor={{
            true: preferenceSwitchInactiveColorConverter(primary),
            false: PREFERENCE_SWITCH_INACTIVE_COLOR,
          }}
          thumbColor={isEnabled ? primary : WHITE}
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
