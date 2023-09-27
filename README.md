# This SDK is deprecated

[👉 Here is the new Courier React Native SDK](https://github.com/trycourier/courier-react-native)

# @trycourier/react-native-inbox

a react native library for trycourier integration

## Installation

```sh
npm install @trycourier/react-native-inbox react-native-linear-gradient
```

```sh
yarn add @trycourier/react-native-inbox react-native-linear-gradient
```

for ios development, navigate to ios folder in project repository and update pod

```sh
pod update
```

## Usage

wrap your parent component using `CourierProvider`, provide `clientKey`, `userId` , `brandId` as props

###

```js
import React from 'react';
import { CourierProvider } from '@trycourier/react-native-inbox';

export default function App() {
  return (
    <CourierProvider clientKey={CLIENT_KEY} userId={USER_ID} brandId={BRAND_ID}>
      .....
    </CourierProvider>
  );
}
```

import and use `CourierScreen` anywhere in your child component

```js
import { CourierScreen } from '@trycourier/react-native-inbox';

const Demo = () => {
  return (
    <View>
      ...
      <CourierScreen onMessageClick={message => {
          console.log('clicked message data', message);
      }} />
      ...
    </View>
  );
};
```

### the bellIcon

```jsx
import { BellIcon } from '@trycourier/react-native-inbox';

function BellIconScreen() {
  return (
    <View>
      ...
      <BellIcon showUnreadMessageCount size="md" />
      ...
    </View>
  );
}
```

## CourierProvider props

---

| prop         | description                                         | default   | type                               |
| ------------ | --------------------------------------------------- | --------- | ---------------------------------- |
| onNewMessage | custom function to execute on getting a new Message | undefined | (message: ICourierMessage) => void |

## CourierScreen props

---

| prop           | description                                      | default   | type                           |
| -------------- | ------------------------------------------------ | --------- | ------------------------------ |
| onMessageClick | custom function to execute on pressing a Message | undefined | (message: MessageType) => void |

## BellIcon props

---

| prop                   | description                                           | default   | type                                              |
| ---------------------- | ----------------------------------------------------- | --------- | ------------------------------------------------- |
| showUnreadMessageCount | shows number of unread messages as badge              | false     | boolean                                           |
| size                   | sets height and width of the bell icon and badge size | "md"      | "md" \| "sm" \| "lg"                              |
| render                 | renders custom component                              | undefined | (\_numberOfUnreadMessages: number) => JSX.Element |

you can find a proper implementation example [here](https://github.com/trycourier/courier-react-native-inbox/tree/main/exampleRn).

## License

MIT
