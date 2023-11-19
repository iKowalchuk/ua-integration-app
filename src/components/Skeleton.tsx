import { useColorMode, useToken } from '@gluestack-style/react';
import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

type SkeletonProps = {
  width: number | `${number}%`;
  height: number | `${number}%`;
  borderRadius: number;
};

const Skeleton = ({ width, height, borderRadius }: SkeletonProps) => {
  const colorMode = useColorMode();

  console.log(colorMode);

  const firstLightColor = useToken('colors', 'secondary50');
  const secondLightColor = useToken('colors', 'secondary100');
  const firstDarkColor = useToken('colors', 'secondary900');
  const secondDarkColor = useToken('colors', 'secondary950');

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const animatedColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      colorMode === 'light' ? firstLightColor : firstDarkColor,
      colorMode === 'light' ? secondLightColor : secondDarkColor,
    ],
  });

  return (
    <Animated.View
      style={[{ backgroundColor: animatedColor, width, height, borderRadius }]}
    />
  );
};

export default Skeleton;
