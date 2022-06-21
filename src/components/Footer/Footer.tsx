import { View, StyleSheet, Image } from 'react-native';
import React from 'react';
import { LIGHT_GRAY } from '../../constants/colors';
import { useBrand } from '../../context/CourierProvider';
import poweredByCourierLogo from '../../assets/PoweredByCourier.png';

const styles = StyleSheet.create({
  container: {
    height: 42,
    backgroundColor: LIGHT_GRAY,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function Footer() {
  const { disableCourierFooter } = useBrand();

  if (disableCourierFooter) return null;
  return (
    <View style={styles.container}>
      <Image source={poweredByCourierLogo} />
    </View>
  );
}

export default Footer;
