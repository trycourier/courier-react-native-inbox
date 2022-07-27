import { Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
import React from 'react';
import tick from '../../assets/tick.png';
import { FONT_SMALL, SEMI_BOLD } from '../../constants/fontSize';
import {
  WHITE,
  PREFERENCE_CHIP_BORDER_COLOR,
  PREFERENCE_PRIMARY_STYLE,
} from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderColor: PREFERENCE_CHIP_BORDER_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: FONT_SMALL,
    color: PREFERENCE_CHIP_BORDER_COLOR,
    fontWeight: SEMI_BOLD,
    paddingVertical: 1,
  },
  selectedContainerStyle: {
    borderWidth: 0,
    backgroundColor: PREFERENCE_PRIMARY_STYLE,
    paddingLeft: 7,
  },
  selectedChipTextStyle: {
    color: WHITE,
  },
  imageStyle: {
    marginRight: 6,
    height: 6,
    width: 6,
  },
});

type Prop = {
  title: string;
  isSelected?: boolean;
  onPress: () => void;
};
function Chip({ title, isSelected, onPress }: Prop) {
  const containerStyle: ViewStyle[] = [styles.container];
  const textStyle: TextStyle[] = [styles.textStyle];
  if (isSelected) {
    containerStyle.push(styles.selectedContainerStyle);
    textStyle.push(styles.selectedChipTextStyle);
  }
  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      {isSelected && <Image source={tick} style={styles.imageStyle} />}
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

Chip.defaultProps = {
  isSelected: false,
};

export default Chip;
