import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CUSTOMIZATION_OPTIONS_BACKGROUND_COLOR } from '../../constants/colors';
import { FONT_SMALL, SEMI_BOLD } from '../../constants/fontSize';
import { Checkbox } from '../Checkbox';
import { Chip } from '../Chip';
import { capitalize } from '../../utils/helper';
import type {
  SelectedOptionType,
  UpdateSelectedOptionsType,
  RecipientPreferenceType,
} from './types';

const styles = StyleSheet.create({
  container: {
    backgroundColor: CUSTOMIZATION_OPTIONS_BACKGROUND_COLOR,
    borderRadius: 15,
    padding: 5,
  },
  CustomizeHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxStyle: {
    marginRight: 8,
    borderRadius: 10,
  },
  customizeHeaderTextStyle: {
    fontWeight: SEMI_BOLD,
    fontSize: FONT_SMALL,
  },
  optionsContainer: {
    marginLeft: 28,
    marginTop: 12,
    flexDirection: 'row',
  },
  chipContainerStyle: {
    marginRight: 10,
  },
});

const allOptions: SelectedOptionType[] = ['email', 'push'];

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

type PropType = {
  title: string;
  recipientPreference: RecipientPreferenceType;
  handlePreferenceChange: (
    _newPreferences: RecipientPreferenceType
  ) => Promise<any>;
};

function CustomizeOptions({
  title,
  recipientPreference,
  handlePreferenceChange,
}: PropType) {
  const isSelected = recipientPreference.hasCustomRouting;
  const selectedOptions = recipientPreference.routingPreferences;

  const updateSelectedOptions: UpdateSelectedOptionsType = (
    option: SelectedOptionType
  ) => {
    const updatedArray = getUpdatedArray({
      option,
      currentSelectedOptions: selectedOptions,
    });
    handlePreferenceChange({
      ...recipientPreference,
      routingPreferences: updatedArray,
    });
  };

  const toggleSelected = () => {
    const checked = recipientPreference.hasCustomRouting;
    handlePreferenceChange({
      ...recipientPreference,
      hasCustomRouting: !checked,
      routingPreferences: !checked ? ['email', 'push'] : [],
    });
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggleSelected}
        style={styles.CustomizeHeaderContainer}
      >
        <Checkbox
          containerStyle={styles.checkboxStyle}
          checked={isSelected}
          onValueChange={toggleSelected}
        />
        <Text style={styles.customizeHeaderTextStyle}>{title}</Text>
      </TouchableOpacity>
      {isSelected && (
        <View style={styles.optionsContainer}>
          {allOptions.map((option) => (
            <View style={styles.chipContainerStyle} key={option}>
              <Chip
                title={capitalize(option)}
                isSelected={selectedOptions.includes(option)}
                onPress={() => {
                  updateSelectedOptions(option);
                }}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default CustomizeOptions;
