import { Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { ICourierMessage, useCourier } from '@trycourier/react-provider';

type PropType = {
  size: number;
};

function BellIcon({ size }: PropType) {
  if (size < 0) throw new Error('Size can not be less than 0');
  const courier = useCourier();
  const spinValue = useRef(new Animated.Value(0)).current;
  const stable = () =>
    Animated.timing(spinValue, {
      toValue: 0,
      useNativeDriver: true,
      duration: 50,
      easing: Easing.ease,
    }).start();

  const goRight = () =>
    Animated.timing(spinValue, {
      toValue: -0.05,
      useNativeDriver: true,
      duration: 75,
      easing: Easing.ease,
    }).start(stable);

  const reset1 = () =>
    Animated.timing(spinValue, {
      toValue: 0,
      useNativeDriver: true,
      duration: 75,
      easing: Easing.ease,
    }).start(goRight);

  const goLeft = () =>
    Animated.timing(spinValue, {
      toValue: 0.08,
      useNativeDriver: true,
      duration: 100,
      easing: Easing.ease,
    }).start(reset1);

  const spin = spinValue.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-360deg', '360deg'],
  });

  useEffect(() => {
    courier.transport.intercept((message: ICourierMessage) => {
      goLeft();
      return message;
    });
  });

  return (
    <Animated.View
      style={{
        height: size,
        width: size,
        borderRadius: size / 2,
        backgroundColor: 'yellow',
        transform: [
          { translateY: -size / 2 },
          { rotate: spin },
          { translateY: size / 2 },
        ],
      }}
    />
  );
}

export default BellIcon;
