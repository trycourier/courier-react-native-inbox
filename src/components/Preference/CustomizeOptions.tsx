import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CUSTOMIZATION_OPTIONS_BACKGROUND_COLOR } from '../../constants/colors';
import { FONT_SMALL, SEMI_BOLD } from '../../constants/fontSize';
import { Checkbox } from '../Checkbox';
import { Chip } from '../Chip';
import type { SelectedOptionType, UpdateSelectedOptionsType } from './types';

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

type PropType = {
  title: string;
  options: SelectedOptionType[];
  selectedOptions: SelectedOptionType[];
  updateSelectedOptions: UpdateSelectedOptionsType;
  resetSelectedOptions: () => void;
};

function CustomizeOptions({
  title,
  options,
  selectedOptions,
  updateSelectedOptions,
  resetSelectedOptions,
}: PropType) {
  const [isSelected, setIsSelected] = useState(false);
  const toggleSelected = () => {
    setIsSelected((prev) => !prev);
    if (!isSelected) {
      resetSelectedOptions();
    }
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
          {options.map((option) => (
            <View style={styles.chipContainerStyle} key={option}>
              <Chip
                title={option}
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
