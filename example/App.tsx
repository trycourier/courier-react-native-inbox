import React from 'react';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { CourierProvider } from '@trycourier/react-native-inbox';
// eslint-disable-next-line
import { CLIENT_KEY, USER_ID, BRAND_ID } from '@env';
import { LinearGradient } from 'expo-linear-gradient';
import { Navigation } from './navigation';

export default function App() {
  return (
    <CourierProvider
      clientKey={CLIENT_KEY}
      userId={USER_ID}
      brandId={BRAND_ID}
      linearGradientProvider={LinearGradient}
    >
      <Navigation />
      {/* eslint react/style-prop-object: 0 */}
      <StatusBar style="auto" />
    </CourierProvider>
  );
}
