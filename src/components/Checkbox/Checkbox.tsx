import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import type { ViewStyle, ImageStyle } from 'react-native';
import React from 'react';
import { BLACK, PREFERENCE_PRIMARY_STYLE } from '../../constants/colors';

import tick from '../../assets/tick.png';

const styles = StyleSheet.create({
  container: {
    height: 20,
    width: 20,
    borderColor: BLACK,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedContainer: {
    backgroundColor: PREFERENCE_PRIMARY_STYLE,
    borderWidth: 0,
  },
  imageSize: {
    height: 13,
    width: 10,
  },
});

type Prop = {
  containerStyle?: ViewStyle;
  checked?: boolean;
  activeColor?: string;
  imageStyle?: ImageStyle;
  onValueChange: () => void;
};

function Checkbox({
  containerStyle = {},
  checked,
  activeColor = '',
  imageStyle = {},
  onValueChange,
}: Prop) {
  const touchableOpacityStyle: ViewStyle[] = [styles.container, containerStyle];
  if (checked) {
    touchableOpacityStyle.push(styles.checkedContainer);
    if (activeColor)
      touchableOpacityStyle.push({ backgroundColor: activeColor });
  }
  return (
    <TouchableOpacity style={touchableOpacityStyle} onPress={onValueChange}>
      {checked && (
        <Image source={tick} style={(styles.imageSize, imageStyle)} />
      )}
    </TouchableOpacity>
  );
}

Checkbox.defaultProps = {
  containerStyle: undefined,
  checked: false,
  activeColor: '',
  imageStyle: undefined,
};

export default Checkbox;
