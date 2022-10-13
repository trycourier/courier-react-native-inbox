
# @trycourier/react-native-inbox"

a react native library for trycourier integration

## Installation

```sh
npm install @trycourier/react-native-inbox @react-navigation/native
```

```sh
yarn add @trycourier/react-native-inbox @react-navigation/native
```

## Usage 

wrap your parent component using `CourierProvider`, provide  `clientKey`,  `userId` , `brandId` as props

### if you are using react-native cli 
```sh
yarn add react-native-linear-gradient
```

```js
import LinearGradient from 'react-native-linear-gradient';
```

### if you are using expo-cli

```sh
yarn add react-native-linear-gradient 
```
```js
import { LinearGradient } from 'expo-linear-gradient';
```
wrap your parent component with CourierProvider


### 
```js
import React from 'react';
import { CourierProvider } from '@trycourier/react-native-inbox';

export default function App() {
  return (
      <CourierProvider
        clientKey={CLIENT_KEY}
        userId={USER_ID}
        brandId={BRAND_ID}
        linearGradientProvider={LinearGradient}
      >
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
      <CourierScreen/>
    </View>
  )
}
```

### the bellIcon

```jsx
import { BellIcon } from '@trycourier/react-native-inbox';

function BellIconScreen() {
  return (
    <View>
        <BellIcon showUnreadMessageCount size="md" />
    </View>
  );
}
```
|  prop| description | default | type |
|--|--|--|--|
|showUnreadMessageCount | shows number of unread messages as badge|	 false | boolean
| size | sets height and width of the bell icon and badge size| "md" | "md" \| "sm" \| "lg" 
|render| renders custom component| undefined | (_numberOfUnreadMessages: number) => JSX.Element|
|onMessage| custom function to execute on getting a new Message | undefined | (_numberOfUnreadMessages: number) => void

**Note**:  BellIcon must be used as a child component of `NavigationContainer` to work.

you can find a proper implementation example [here](https://github.com/trycourier/courier-react-native-inbox/tree/main/example).


## License

MIT
