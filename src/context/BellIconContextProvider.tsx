import React, { useRef, createContext, useContext } from 'react';
import { Animated, Easing } from 'react-native';

const LEFT_DURATION = 100;
const RIGHT_DURATION = 120;
const CENTER_DURATION = 75;

type BellIconContextType = {
  goLeft: () => void;
  spin?: Animated.AnimatedInterpolation;
};
const BellIconContext = createContext<BellIconContextType>({
  goLeft: () => {},
});

type PropType = {
  children: JSX.Element | JSX.Element[];
};

function BellIconContextProvider({ children }: PropType) {
  const spinValue = useRef(new Animated.Value(0)).current;

  const stable = () =>
    Animated.timing(spinValue, {
      toValue: 0,
      useNativeDriver: true,
      duration: CENTER_DURATION,
      easing: Easing.ease,
    }).start();

  const goRight = () =>
    Animated.timing(spinValue, {
      toValue: -9,
      useNativeDriver: true,
      duration: RIGHT_DURATION,
      easing: Easing.ease,
    }).start(stable);

  const goLeft = () =>
    Animated.timing(spinValue, {
      toValue: 10,
      useNativeDriver: true,
      duration: LEFT_DURATION,
      easing: Easing.ease,
    }).start(goRight);

  const spin = spinValue.interpolate({
    inputRange: [-360, 360],
    outputRange: ['-360deg', '360deg'],
  });

  return (
    <BellIconContext.Provider value={{ spin, goLeft }}>
      {children}
    </BellIconContext.Provider>
  );
}

export default BellIconContextProvider;

export const useBellIcon = () => {
  const { spin, goLeft: nudgeBellIcon } = useContext(BellIconContext);

  return {
    spin,
    nudgeBellIcon,
  };
};
