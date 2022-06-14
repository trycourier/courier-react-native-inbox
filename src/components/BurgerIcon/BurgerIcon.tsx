import { TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import SvgDot from '../SvgDot/SvgDot';

const Styles = StyleSheet.create({
  gap: { marginBottom: 4 },
});

function BurgerIcon({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <SvgDot size={4} color="gray" style={Styles.gap} />
      <SvgDot size={4} color="gray" style={Styles.gap} />
      <SvgDot size={4} color="gray" />
    </TouchableOpacity>
  );
}

export default BurgerIcon;
