import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import BellIcon from '@trycourier/react-native-inbox/src/components/BellIcon/BellIcon';
import { CourierScreenNavigationProp } from '../../navigation/stack/stackNavigation.types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function LandingScreen() {
  const navigation = useNavigation<CourierScreenNavigationProp>();
  const goToCourier = () => {
    navigation.navigate('Courier');
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goToCourier}>
        <BellIcon size={50} />
      </TouchableOpacity>
    </View>
  );
}

export default LandingScreen;
