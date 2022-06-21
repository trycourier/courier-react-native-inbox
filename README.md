# @trycourier/react-native-inbox"

a react native library for trycourier integration

## Installation

```sh
npm install @trycourier/react-native-inbox
```

```sh
yarn add @trycourier/react-native-inbox
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
			<Text>StackNavigation</Text>
		</View>
	)
}
```

you can find a proper implementation example [here](https://github.com/trycourier/courier-react-native-inbox/tree/main/example).


## License

MIT
