import { Text } from '@gluestack-ui/themed';
import React from 'react';

type TabBarLabelProps = { focused: boolean; color: string; children: string };

const TabBarLabel = ({ children, color }: TabBarLabelProps) => (
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
