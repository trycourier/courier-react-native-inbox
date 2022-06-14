import React from 'react';
import { CourierScreen } from 'react-native-trycourier';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './stackNavigation.types';

import { LandingScreen } from '../../screens/LandingScreen';

const Stack = createStackNavigator<RootStackParamList>();

function StackNavigation() {
  return (
    <Stack.Navigator initialRouteName="Home">
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
