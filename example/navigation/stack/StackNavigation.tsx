import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  CourierScreen,
  PreferenceScreen,
} from '@trycourier/react-native-inbox';
import { RootStackParamList } from './stackNavigation.types';

import { LandingScreen } from '../../screens/LandingScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function StackNavigation() {
  return (
    <Stack.Navigator initialRouteName="Preference">
      <Stack.Screen
        name="Preference"
        component={PreferenceScreen}
        options={{ title: 'Preference' }}
      />

      <Stack.Screen
        name="Home"
        component={LandingScreen}
        options={{ title: 'Home' }}
      />
      <Stack.Screen
        name="Courier"
        component={CourierScreen}
        options={{ title: 'Courier' }}
      />
    </Stack.Navigator>
  );
}

export default StackNavigation;
