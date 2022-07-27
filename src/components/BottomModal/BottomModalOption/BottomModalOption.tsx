import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { STORM_BLUE } from '../../../constants/colors';
import { FONT_MEDIUM } from '../../../constants/fontSize';

const styles = StyleSheet.create({
  markReadStyle: {
    color: STORM_BLUE,
    fontSize: FONT_MEDIUM,
    paddingTop: 14,
    paddingBottom: 23,
  },
  touchableOpacityContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

type PropType = {
  onPress: () => void;
  option: string;
};

function BottomModalOption({ onPress, option }: PropType) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.touchableOpacityContainer}
    >
      <Text style={styles.markReadStyle}>{option}</Text>
    </TouchableOpacity>
  );
}

export default BottomModalOption;
