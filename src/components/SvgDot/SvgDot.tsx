import { View, StyleSheet, ViewStyle } from 'react-native';
import React from 'react';
import DotText from './DotText';

type Prop = {
  size: 4 | 8 | 26;
  color: string;
  style?: ViewStyle;
  show?: boolean;
  value?: number;
};

const getColor = ({ show, dotColor }: { show: boolean; dotColor: string }) => {
  if (!show) return 'transparent';
  return dotColor;
};

function SvgDot({
  size, color, style, show = true, value,
}: Prop) {
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

  if (typeof value !== 'undefined') {
    if (value === 0) return null;
    return (
      <View style={[styles.container, styles.flexibleHeightWidth, style]}>
        <DotText value={value} />
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
