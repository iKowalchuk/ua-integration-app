import { Center, Heading } from '@gluestack-ui/themed';
import React, { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Control } from '@/api/getControls';
import IOSectionList from '@/components/IOSectionList';
import LoadingView from '@/components/LoadingView';
import { useAuthContext } from '@/contexts/AuthContext';
import ControlCard from '@/screens/ControlsScreen/ControlCard';
import useControlsStore from '@/stores/useControlsStore';

const ControlsScreen = () => {
  const { authState } = useAuthContext();

  const { controls, fetchControls } = useControlsStore(
    useShallow((state) => ({
      controls: state.controls,
      fetchControls: state.fetchControls,
    }))
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getMenuRequest = async () => {
      if (authState.type !== 'authenticated') {
        return;
      }

      try {
        setIsLoading(true);
        await fetchControls({
          apiURL: authState.session.apiURL,
          token: authState.session.token,
        });
      } finally {
        setIsLoading(false);
      }
    };

    getMenuRequest();
  }, [authState]);

  const sectionMenu = useMemo(() => {
    return Object.entries(
      controls.reduce(
        (acc: { [key: string]: Control[] }, { groupName, ...other }) =>
          Object.assign(acc, {
            [groupName]: [...(acc[groupName] || []), { groupName, ...other }],
          }),
        {}
      )
    ).map(([key, value]) => ({ title: key, data: value }));
  }, [controls]);

  if (isLoading) {
    return <LoadingView />;
  }

  return (
    <IOSectionList
      contentContainerStyle={{
        gap: 16,
        padding: 16,
      }}
      sections={sectionMenu}
      renderItem={({ item }) => <ControlCard control={item} />}
      renderSectionHeader={({ section: { title } }) => (
        <Center>
          <Heading size="xl">{title}</Heading>
        </Center>
      )}
      keyExtractor={(item) => item.id}
      stickySectionHeadersEnabled={false}
    />
  );
};

export default ControlsScreen;
