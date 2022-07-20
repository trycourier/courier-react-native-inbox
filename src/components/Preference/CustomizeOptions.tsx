import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { CUSTOMIZATION_OPTIONS_BACKGROUND_COLOR } from '../../constants/colors';
import { Checkbox } from '../Checkbox';
import { SEMI_BOLD } from '../../constants/fontSize';
import { Chip } from '../Chip';

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
    fontSize: 12,
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
  options: string[];
};

function CustomizeOptions({ title, options }: PropType) {
  const [isSelected, setIsSelected] = useState(false);
  const toggleSelected = () => {
    setIsSelected((prev) => !prev);
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
            <View style={styles.chipContainerStyle}>
              <Chip
                key={option}
                title={option}
                isSelected={option === options[0]}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default CustomizeOptions;
