import { Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { ICourierMessage, useCourier } from '@trycourier/react-provider';
import { useBrand } from '../../context/CourierReactNativeProvider';

type PropType = {
  size: number;
};

function BellIcon({ size }: PropType) {
  if (size < 0) throw new Error('Size can not be less than 0');
  const courier = useCourier();
  const spinValue = useRef(new Animated.Value(0)).current;
  const {
    colors: { primary },
  } = useBrand();
  const stable = () =>
    Animated.timing(spinValue, {
      toValue: 0,
      useNativeDriver: true,
      duration: 75,
      easing: Easing.ease,
    }).start();

  const goRight = () =>
    Animated.timing(spinValue, {
      toValue: -0.05,
      useNativeDriver: true,
      duration: 150,
      easing: Easing.ease,
    }).start(stable);

  const goLeft = () =>
    Animated.timing(spinValue, {
      toValue: 0.08,
      useNativeDriver: true,
      duration: 100,
      easing: Easing.ease,
    }).start(goRight);

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
        backgroundColor: primary,
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
