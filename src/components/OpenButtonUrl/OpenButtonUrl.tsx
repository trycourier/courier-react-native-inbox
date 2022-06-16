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
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    borderRadius: 4,
  },
  buttonTextStyle: {
    color: WHITE,
    fontSize: 12,
    textAlign: 'center',
  },
});

function OpenURLButton({
  url,
  title,
  onSuccess,
}: {
  url: string;
  title: string;
  onSuccess?: () => void;
}) {
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

      // this delay is needed, else the onSuccess will cause problem
      await Linking.openURL(url);
      if (typeof onSuccess === 'function') onSuccess();
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url, onSuccess]);

  return (
    <TouchableOpacity onPress={handlePress} style={buttonStyle}>
      <Text style={styles.buttonTextStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

OpenURLButton.defaultProps = {
  onSuccess: undefined,
};

export default OpenURLButton;
