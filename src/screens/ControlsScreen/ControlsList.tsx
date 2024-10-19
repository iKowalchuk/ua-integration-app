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
        gap: 16,
        padding: 16,
      }}
      data={data}
      renderItem={({ item }) => <ControlItem control={item} />}
      keyExtractor={(item) => `${item.id}`}
    />
  );
};

export default ControlsList;
