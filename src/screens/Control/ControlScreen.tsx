import { Center, Heading } from '@gluestack-ui/themed';
import React, { useEffect, useMemo, useState } from 'react';

import getMenu, { Menu } from '@/api/getMenu';
import IOSectionList from '@/components/IOSectionList';
import { useAuthContext } from '@/contexts/AuthContext';
import ControlCard from '@/screens/Control/ControlCard';
import LoadingScreen from '@/screens/LoadingScreen';

const ControlScreen = () => {
  const { authState } = useAuthContext();

  const [menu, setMenu] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getMenuRequest = async () => {
      if (authState.type !== 'authenticated') {
        return;
      }

      try {
        setIsLoading(true);
        const data = await getMenu({
          apiURL: authState.session.apiURL,
          token: authState.session.token,
        });
        setMenu(data);
      } finally {
        setIsLoading(false);
      }
    };

    getMenuRequest();
  }, [authState]);

  const sectionMenu = useMemo(() => {
    return Object.entries(
      menu.reduce(
        (acc: { [key: string]: Menu[] }, { nameGroup, ...other }) =>
          Object.assign(acc, {
            [nameGroup]: [...(acc[nameGroup] || []), { nameGroup, ...other }],
          }),
        {}
      )
    ).map(([key, value]) => ({ title: key, data: value }));
  }, [menu]);

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
        <ControlCard label={item.descr} command={item.pCmdIn} />
      )}
      renderSectionHeader={({ section: { title } }) => (
        <Center>
          <Heading size="xl">{title}</Heading>
        </Center>
      )}
      keyExtractor={(item) => item.pCmdIn}
      stickySectionHeadersEnabled={false}
    />
  );
};

export default ControlScreen;
