import { Text, StyleSheet, TextStyle, TouchableOpacity } from 'react-native';
import React from 'react';
import type { ViewStyle } from 'react-native';
import { GRAY } from '../../constants/colors';
import { SEMI_BOLD } from '../../constants/fontSize';
import { useBrand } from '../../context/CourierReactNativeProvider';

type PropType = {
  isActive: boolean;
  title: string;
  onPress: () => void;
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 39,
    flex: 1,
  },
  textStyle: {
    color: GRAY,
  },
  containerActiveStyle: {
    borderBottomWidth: 2,
    height: 41,
  },
  textActiveStyle: {
    fontWeight: SEMI_BOLD,
  },
});

function Tab({ isActive, title, onPress }: PropType) {
  const {
    colors: { primary },
  } = useBrand();

  const containerStyle: ViewStyle[] = [styles.container];
  const textStyle: TextStyle[] = [styles.textStyle];

  if (isActive) {
    containerStyle.push({
      ...styles.containerActiveStyle,
      borderBottomColor: primary,
    });
    textStyle.push({ ...styles.textActiveStyle, color: primary });
  }

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={() => {
        if (isActive) return;
        onPress();
      }}
    >
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

export default Tab;
