import React from 'react';
import { CourierProvider } from '@trycourier/react-provider';
import 'localstorage-polyfill';
import type { Props } from './CourierReactNativeProvider';
import CourierReactNativeProvider from './CourierReactNativeProvider';
import BellIconContextProvider from './BellIconContextProvider';

function CourierProviderWrapper({
  children,
  userId,
  clientKey,
  brandId,
  onNewMessage,
}: Props) {
  return (
    <CourierProvider userId={userId} clientKey={clientKey}>
      <BellIconContextProvider>
        <CourierReactNativeProvider
          userId={userId}
          clientKey={clientKey}
          brandId={brandId}
          onNewMessage={onNewMessage}
        >
          {children}
        </CourierReactNativeProvider>
      </BellIconContextProvider>
    </CourierProvider>
  );
}

export default CourierProviderWrapper;
