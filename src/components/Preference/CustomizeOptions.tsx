import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { CUSTOMIZATION_OPTIONS_BACKGROUND_COLOR } from '../../constants/colors';
import { Checkbox } from '../Checkbox';

const styles = StyleSheet.create({
  container: {
    backgroundColor: CUSTOMIZATION_OPTIONS_BACKGROUND_COLOR,
    borderRadius: 15,
    padding: 7,
  },
  optionsContainer: {
    flexDirection: 'row',
  },
  checkboxStyle: {
    marginRight: 8,
    borderRadius: 10,
  },
});

type PropType = {
  title: string;
};

function CustomizeOptions({ title }: PropType) {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        <View style={styles.optionsContainer}>
          <Checkbox
            containerStyle={styles.checkboxStyle}
            checked={isSelected}
            onValueChange={() => {
              setIsSelected((prev) => !prev);
            }}
          />
          <View>
            <Text>{title}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default CustomizeOptions;
