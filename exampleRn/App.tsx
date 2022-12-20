import React from 'react';
import {CourierProvider, CourierScreen} from '@trycourier/react-native-inbox';

import {CLIENT_KEY, USER_ID, BRAND_ID} from '@env';

const App = () => {
  console.log({CLIENT_KEY, USER_ID, BRAND_ID});
  return (
    <CourierProvider clientKey={CLIENT_KEY} userId={USER_ID} brandId={BRAND_ID}>
      <CourierScreen />
    </CourierProvider>
  );
};

export default App;
