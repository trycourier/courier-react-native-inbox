import { View, Text, StyleSheet, Switch } from 'react-native';
import React, { useState } from 'react';
import {
  DIVIDER_COLOR,
  GRAY,
  PREFERENCE_SWITCH_ACTIVE_COLOR,
  PREFERENCE_SWITCH_INACTIVE_COLOR,
  PREFERENCE_PRIMARY_STYLE,
  WHITE,
} from '../../constants/colors';
import { SEMI_BOLD } from '../../constants/fontSize';
import CustomizeOptions from './CustomizeOptions';
import type { PreferencesStatusType } from '../../context/Brands/brands.types';
import type { SelectedOptionType, UpdateSelectedOptionsType } from './types';

const styles = StyleSheet.create({
  overAll: {
    borderColor: DIVIDER_COLOR,
    borderTopWidth: 1,
    paddingVertical: 26,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleStyle: {
    fontSize: 14,
    fontWeight: SEMI_BOLD,
  },
  subTitleStyle: {
    fontSize: 12,
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

function Preference({ title, subtitle, optionsTitle, status }: Props) {
  const isEnabled = status === 'OPTED_IN' || status === 'REQUIRED';
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionType[]>([
    'Email',
    'Push',
  ]);

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
            true: PREFERENCE_SWITCH_ACTIVE_COLOR,
            false: PREFERENCE_SWITCH_INACTIVE_COLOR,
          }}
          thumbColor={isEnabled ? PREFERENCE_PRIMARY_STYLE : WHITE}
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
