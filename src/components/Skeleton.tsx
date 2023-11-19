import { useToken } from '@gluestack-style/react';
import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

type SkeletonProps = {
  width: number | `${number}%`;
  height: number | `${number}%`;
  borderRadius: number;
};

const Skeleton = ({ width, height, borderRadius }: SkeletonProps) => {
  const firstColor = useToken('colors', 'trueGray100');
  const secondColor = useToken('colors', 'trueGray200');

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
    outputRange: [firstColor, secondColor],
  });

  return (
    <Animated.View
      style={[{ backgroundColor: animatedColor, width, height, borderRadius }]}
    />
  );
};

export default Skeleton;
