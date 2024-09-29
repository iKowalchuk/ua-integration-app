import { Text } from '@gluestack-ui/themed';
import React, { type PropsWithChildren } from 'react';

type TabBarLabelProps = {
  color: string;
  focused: boolean;
};

const TabBarLabel = ({
  color,
  children,
}: PropsWithChildren<TabBarLabelProps>) => (
  <Text
    fontSize={14}
    fontWeight={500}
    textAlign="center"
    maxWidth={200}
    numberOfLines={1}
    color={color}
  >
    {children}
  </Text>
);

export default TabBarLabel;
