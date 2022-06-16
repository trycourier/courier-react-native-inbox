import { TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import SvgDot from '../SvgDot/SvgDot';

const Styles = StyleSheet.create({
  gap: { marginBottom: 4 },
  touchStyle: {
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
});

function BurgerIcon({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={Styles.touchStyle}>
      <SvgDot size={4} color="gray" style={Styles.gap} />
      <SvgDot size={4} color="gray" style={Styles.gap} />
      <SvgDot size={4} color="gray" />
    </TouchableOpacity>
  );
}

export default BurgerIcon;
