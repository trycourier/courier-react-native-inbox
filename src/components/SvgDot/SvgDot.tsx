import { View, StyleSheet, ViewStyle } from 'react-native';
import React from 'react';
import DotText from './DotText';

export type Dotsize = 4 | 8 | 12 | 26;

type Prop = {
  size: Dotsize;
  color: string;
  style?: ViewStyle;
  show?: boolean;
  value?: number;
  showNumber?: boolean;
};

const getColor = ({ show, dotColor }: { show: boolean; dotColor: string }) => {
  if (!show) return 'transparent';
  return dotColor;
};

const getFontSize = (size: Dotsize) => {
  if (size === 26) return 18;
  if (size === 12) return 10;
  return 4;
};

function SvgDot({ size, color, style, show = true, value, showNumber }: Prop) {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: getColor({ show, dotColor: color }),
      borderRadius: size / 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    fixedHeightWidth: {
      height: size,
      width: size,
    },
    flexibleHeightWidth: {
      minHeight: size,
      minWidth: size,
    },
  });

  if (typeof value !== 'undefined' && showNumber) {
    if (value === 0) return null;
    return (
      <View style={[styles.container, styles.flexibleHeightWidth, style]}>
        <DotText value={value} fontSize={getFontSize(size)} />
      </View>
    );
  }

  return <View style={[styles.container, styles.fixedHeightWidth, style]} />;
}

SvgDot.defaultProps = {
  style: {},
  show: true,
  value: undefined,
};

export default SvgDot;

SvgDot.defaultProps = {
  showNumber: true,
};
