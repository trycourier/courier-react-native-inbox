import { View, StyleSheet } from 'react-native';
import React from 'react';
import { LIGHT_GRAY } from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    height: 41,
    flexDirection: 'row',
    backgroundColor: LIGHT_GRAY,
  },
});

type PropType = {
  children: JSX.Element | JSX.Element[];
};

function TabsContainer({ children }: PropType) {
  return <View style={styles.container}>{children}</View>;
}

export default TabsContainer;
