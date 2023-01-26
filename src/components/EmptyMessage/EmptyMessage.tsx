import { View, StyleSheet } from 'react-native';
import React from 'react';
import { GRAY } from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    borderRadius: 4,
    paddingVertical: 16,
    paddingHorizontal: 36,
  },

  emptyTitle: {
    height: 16,
    backgroundColor: 'black',
    width: 140,
    marginBottom: 6,
  },
  emptySubTitle: {
    height: 12,
    backgroundColor: GRAY,
    width: 100,
  },
});

function EmptyMessage() {
  return (
    <View style={styles.container}>
      <View style={styles.emptyTitle} />
      <View style={styles.emptySubTitle} />
    </View>
  );
}

export default EmptyMessage;
