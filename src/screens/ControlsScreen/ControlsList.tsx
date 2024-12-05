import React from 'react';
import { IOFlatList } from 'react-native-intersection-observer';

import { type Control } from '@/api/getControls';
import ControlItem from '@/screens/ControlsScreen/ControlItem';

type ControlsListProps = {
  data: Control[];
};

const ControlsList = ({ data }: ControlsListProps) => {
  return (
    <IOFlatList
      contentContainerStyle={{
        padding: 16,
        gap: 8,
      }}
      data={data}
      renderItem={({ item }) => <ControlItem control={item} />}
      keyExtractor={(item) => `item-${item.id}`}
    />
  );
};

export default ControlsList;
