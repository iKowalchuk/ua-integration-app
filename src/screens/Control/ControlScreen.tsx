import { Center, Heading } from '@gluestack-ui/themed';
import React, { useEffect, useMemo, useState } from 'react';

import getControls, { Control } from '@/api/getControls';
import IOSectionList from '@/components/IOSectionList';
import { useAuthContext } from '@/contexts/AuthContext';
import ControlCard from '@/screens/Control/ControlCard';
import LoadingScreen from '@/screens/LoadingScreen';

const ControlScreen = () => {
  const { authState } = useAuthContext();

  const [controls, setControls] = useState<Control[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getMenuRequest = async () => {
      if (authState.type !== 'authenticated') {
        return;
      }

      try {
        setIsLoading(true);
        const data = await getControls({
          apiURL: authState.session.apiURL,
          token: authState.session.token,
        });
        setControls(data);
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
    return <LoadingScreen />;
  }

  return (
    <IOSectionList
      contentContainerStyle={{
        gap: 16,
        padding: 16,
      }}
      sections={sectionMenu}
      renderItem={({ item }) => (
        <ControlCard label={item.name} command={item.command} />
      )}
      renderSectionHeader={({ section: { title } }) => (
        <Center>
          <Heading size="xl">{title}</Heading>
        </Center>
      )}
      keyExtractor={(item) => item.command}
      stickySectionHeadersEnabled={false}
    />
  );
};

export default ControlScreen;
