import React from 'react';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { CourierProvider } from '@trycourier/react-native-inbox';
// eslint-disable-next-line
import { CLIENT_KEY, USER_ID, BRAND_ID, SHOW_LOGS } from '@env';
import { startNetworkLogging } from 'react-native-network-logger';
import { Navigation } from './navigation';
import { CustomNetworkLogger } from './components/CustomNetworkLogger';

if (SHOW_LOGS === 'true') startNetworkLogging();
const showLogs = () => SHOW_LOGS === 'true';

export default function App() {
  return (
    <>
      {showLogs() && <CustomNetworkLogger />}
      <CourierProvider
        clientKey={CLIENT_KEY}
        userId={USER_ID}
        brandId={BRAND_ID}
      >
        <Navigation />
        {/* eslint react/style-prop-object: 0 */}
        <StatusBar style="auto" />
      </CourierProvider>
    </>
  );
}
