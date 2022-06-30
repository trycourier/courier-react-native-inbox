import React from 'react';
import { CourierProvider } from '@trycourier/react-provider';
import 'localstorage-polyfill';
import type { Props } from './CourierReactNativeProvider';
import CourierReactNativeProvider from './CourierReactNativeProvider';

function CourierProviderWrapper({
  children,
  userId,
  clientKey,
  brandId,
  linearGradientProvider,
}: Props) {
  return (
    <CourierProvider userId={userId} clientKey={clientKey}>
      <CourierReactNativeProvider
        userId={userId}
        linearGradientProvider={linearGradientProvider}
        clientKey={clientKey}
        brandId={brandId}
      >
        {children}
      </CourierReactNativeProvider>
    </CourierProvider>
  );
}

export default CourierProviderWrapper;
