import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import NetworkLogger from 'react-native-network-logger';

const styles = StyleSheet.create({
  loggerButtonContainer: {
    height: '8%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  loggerTextStyle: {
    color: '#0000EE',
    fontWeight: '600',
    padding: 8,
  },
  loggerContainer: {
    height: '92%',
  },
});

function CustomNetworkLogger() {
  const [isNetworkLoggerVisible, setIsNetworkLoggerVisible] = useState(false);
  const getLoggerText = () =>
    isNetworkLoggerVisible ? 'Hide Logger' : 'Show Logger';
  const toggleLogger = () => setIsNetworkLoggerVisible((prev) => !prev);
  return (
    <>
      <View style={styles.loggerButtonContainer}>
        <TouchableOpacity onPress={toggleLogger}>
          <Text style={styles.loggerTextStyle}>{getLoggerText()}</Text>
        </TouchableOpacity>
      </View>
      {isNetworkLoggerVisible && (
        <View style={styles.loggerContainer}>
          <NetworkLogger />
        </View>
      )}
    </>
  );
}

export default CustomNetworkLogger;
