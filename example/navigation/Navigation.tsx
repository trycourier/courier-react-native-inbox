import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from './stack/StackNavigation';

function Navigation() {
  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  );
}

export default Navigation;
