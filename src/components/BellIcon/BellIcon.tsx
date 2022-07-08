import { Animated, Easing, View } from 'react-native';
import React, { useEffect, useRef, useMemo, useState } from 'react';

import { Messages } from '@trycourier/client-graphql';
import { ICourierMessage, useCourier } from '@trycourier/react-provider';
import { useNavigation } from '@react-navigation/native';
import {
  useBrand,
  useReactNativeCourier,
} from '../../context/CourierReactNativeProvider';
import bellIcon from '../../assets/bell.png';
import { SvgDot } from '../SvgDot';
import type { Dotsize } from '../SvgDot';

const MD_SIZE = 40;
const LG_SIZE = 80;
const SM_SIZE = 24;
const LEFT_DURATION = 100;
const RIGHT_DURATION = 120;
const CENTER_DURATION = 75;
const DOT_DELAY = LEFT_DURATION + RIGHT_DURATION + CENTER_DURATION;

type SizeType = 'sm' | 'md' | 'lg';

type PropType = {
  size?: SizeType;
  showUnreadMessageCount?: boolean;
  render?: (_numberOfUnreadMessages: number) => JSX.Element;
  onMessage?: (_numberOfUnreadMessages: number) => void;
};

const getNumericSize = (
  size: SizeType
): {
  imageSize: number;
  dotRight: number;
  dotTop: number;
  dotSize: Dotsize;
} => {
  if (size === 'lg')
    return { imageSize: LG_SIZE, dotRight: 12, dotTop: 12, dotSize: 26 };
  if (size === 'md')
    return { imageSize: MD_SIZE, dotRight: 6, dotTop: 4, dotSize: 12 };
  return { imageSize: SM_SIZE, dotRight: 3, dotTop: 2, dotSize: 8 };
};

function BellIcon({
  size = 'md',
  showUnreadMessageCount,
  render,
  onMessage,
}: PropType) {
  const courier = useCourier();
  const spinValue = useRef(new Animated.Value(0)).current;
  const {
    colors: { primary },
  } = useBrand();
  const [messageCount, setMessageCount] = useState(0);
  const { courierClient } = useReactNativeCourier();
  const { getMessageCount } = Messages({ client: courierClient });

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

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const getUnreadMessages = async () => {
        try {
          const unreadMessageCount = await getMessageCount({ isRead: false });
          setMessageCount(unreadMessageCount);
        } catch (e) {
          console.log({ e });
        }
      };
      getUnreadMessages();
      courier.transport.intercept((message: ICourierMessage) => {
        if (typeof onMessage === 'function') onMessage(messageCount + 1);
        goLeft();
        setTimeout(() => {
          setMessageCount((prev) => prev + 1);
        }, DOT_DELAY);
        return message;
      });
    });
    return unsubscribe;
  }, [navigation]);

  const { imageSize, dotRight, dotTop, dotSize } = useMemo(
    () => getNumericSize(size),
    [size]
  );

  if (typeof render === 'function') return render(messageCount);

  return (
    <View style={{ position: 'relative' }}>
      {messageCount > 0 && (
        <SvgDot
          size={dotSize}
          color={primary}
          style={{
            position: 'absolute',
            right: dotRight,
            top: dotTop,
            zIndex: 1,
          }}
          value={messageCount}
          showNumber={showUnreadMessageCount}
        />
      )}
      <Animated.Image
        source={bellIcon}
        style={{
          height: imageSize,
          width: imageSize,
          transform: [
            { translateY: -imageSize / 2 },
            { rotate: spin },
            { translateY: imageSize / 2 },
          ],
        }}
      />
    </View>
  );
}

export default BellIcon;

BellIcon.defaultProps = {
  size: 'md',
  showUnreadMessageCount: false,
  render: undefined,
  onMessage: undefined,
};
