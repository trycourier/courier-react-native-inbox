import React, { useCallback } from 'react';
import {
  ViewStyle,
  Alert,
  Linking,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { useBrand } from '../../context/CourierProvider';
import { WHITE } from '../../constants/colors';

const styles = StyleSheet.create({
  buttonStyle: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    minWidth: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  buttonTextStyle: {
    color: WHITE,
    fontSize: 12,
  },
});

function OpenURLButton({ url, title }: { url: string; title: string }) {
  const {
    colors: { primary },
  } = useBrand();

  const buttonStyle: ViewStyle = {
    ...styles.buttonStyle,
    backgroundColor: primary,
  };

  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return (
    <TouchableOpacity onPress={handlePress} style={buttonStyle}>
      <Text style={styles.buttonTextStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

export default OpenURLButton;
