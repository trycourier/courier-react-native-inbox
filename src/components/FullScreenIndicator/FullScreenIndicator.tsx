import { View, StyleSheet, ActivityIndicator } from 'react-native';
import React from 'react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function FullScreenIndicator() {
  return (
    <View style={styles.container}>
      <ActivityIndicator />
    </View>
  );
}

export default FullScreenIndicator;
