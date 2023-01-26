import React from 'react';
import {
  BellIcon,
  CourierProvider,
  CourierScreen,
} from '@trycourier/react-native-inbox';

import {CLIENT_KEY, USER_ID, BRAND_ID} from '@env';
import {SafeAreaView, StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
});

const App = () => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <CourierProvider
          clientKey={CLIENT_KEY}
          userId={USER_ID}
          brandId={BRAND_ID}
          onNewMessage={message => {
            console.log('newMessage', message);
          }}>
          <BellIcon showUnreadMessageCount size="lg" />
          <CourierScreen
            onMessageClick={clickedMessage => {
              console.log('clicked message data', clickedMessage);
            }}
          />
        </CourierProvider>
      </View>
    </SafeAreaView>
  );
};

export default App;
