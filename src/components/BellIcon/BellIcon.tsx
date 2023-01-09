import { Animated, View } from 'react-native';
import React, { useMemo } from 'react';

import {
  useBellIcon,
  useBrand,
} from '../../context/CourierReactNativeProvider';
import bellIcon from '../../assets/bell.png';
import { SvgDot } from '../SvgDot';
import type { Dotsize } from '../SvgDot';

const MD_SIZE = 40;
const LG_SIZE = 80;
const SM_SIZE = 24;

type SizeType = 'sm' | 'md' | 'lg';

type PropType = {
  size?: SizeType;
  showUnreadMessageCount?: boolean;
  render?: (_numberOfUnreadMessages: number) => JSX.Element;
};

const getNumericSize = (
  size: SizeType
): {
  imageSize: number;
  dotRight: number;
  dotTop: number;
  dotSize: Dotsize;
  bellIconContainerWidth: number;
} => {
  if (size === 'lg')
    return {
      imageSize: LG_SIZE,
      dotRight: 12,
      dotTop: 12,
      dotSize: 26,
      bellIconContainerWidth: 84,
    };
  if (size === 'md')
    return {
      imageSize: MD_SIZE,
      dotRight: 6,
      dotTop: 4,
      dotSize: 12,
      bellIconContainerWidth: 40,
    };
  return {
    imageSize: SM_SIZE,
    dotRight: 3,
    dotTop: 2,
    dotSize: 8,
    bellIconContainerWidth: 24,
  };
};

function BellIcon({ size = 'md', showUnreadMessageCount, render }: PropType) {
  const {
    colors: { primary },
  } = useBrand();

  const { spin, unReadBellIconMessageCount } = useBellIcon();

  const { imageSize, dotRight, dotTop, dotSize, bellIconContainerWidth } =
    useMemo(() => getNumericSize(size), [size]);

  if (!spin) return null;

  if (typeof render === 'function') return render(unReadBellIconMessageCount);

  return (
    <View style={{ position: 'relative', width: bellIconContainerWidth }}>
      {unReadBellIconMessageCount > 0 && (
        <SvgDot
          size={dotSize}
          color={primary}
          style={{
            position: 'absolute',
            right: dotRight,
            top: dotTop,
            zIndex: 1,
          }}
          value={unReadBellIconMessageCount}
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
};
