import React from 'react';
import { IOFlatList } from 'react-native-intersection-observer';

import { Control } from '@/api/getControls';
import ControlCard from '@/screens/ControlsScreen/ControlCard';

type ControlSectionDataProps = {
  data: Control[];
};

const ControlSectionData = ({ data }: ControlSectionDataProps) => {
  return (
    <IOFlatList
      contentContainerStyle={{
        gap: 16,
        padding: 16,
      }}
      data={data}
      renderItem={({ item }) => <ControlCard control={item} />}
      keyExtractor={(item) => `${item.id}`}
    />
  );
};

export default ControlSectionData;
