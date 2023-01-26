/* eslint global-require: "off" */

import { View, StyleSheet, Image } from 'react-native';
import React from 'react';
import { LIGHT_GRAY } from '../../constants/colors';
import { useBrand } from '../../context/CourierReactNativeProvider';

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
      <Image source={require('../../assets/footer-title.png')} />
    </View>
  );
}

export default Footer;
