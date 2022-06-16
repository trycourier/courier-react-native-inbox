import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { LIGHT_GRAY } from '../../constants/colors';
import { useBrand } from '../../context/CourierProvider';

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
      <Text>Powered by Courier</Text>
    </View>
  );
}

export default Footer;
