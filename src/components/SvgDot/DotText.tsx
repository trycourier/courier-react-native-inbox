import React from 'react';
import { StyleSheet, TextStyle, Text } from 'react-native';
import { WHITE } from '../../constants/colors';
import { BOLD } from '../../constants/fontSize';

const MAX_DOT_VALUE = 100;

function DotText({ value }: { value: number }) {
  const styles = StyleSheet.create({
    textStyle: {
      fontWeight: BOLD,
      fontSize: 18,
      color: WHITE,
    },
    biggerTextStyle: {
      paddingHorizontal: 4,
    },
  });
  const getTextStyle = () => {
    const textStyle: TextStyle[] = [styles.textStyle];
    if (value.toString().length > 1) return [styles.textStyle, styles.biggerTextStyle];
    return textStyle;
  };
  const getValue = () => {
    if (value >= MAX_DOT_VALUE) return `${MAX_DOT_VALUE - 1}+`;
    return value;
  };
  return <Text style={getTextStyle()}>{getValue()}</Text>;
}

export default DotText;
