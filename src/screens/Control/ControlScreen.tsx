import { Center, Heading } from '@gluestack-ui/themed';
import React, { useEffect, useMemo, useState } from 'react';

import getMenu, { Menu } from '@/api/getMenu';
import IOSectionList from '@/components/IOSectionList';
import { useAuthContext } from '@/hooks/useAuth';
import ControlCard from '@/screens/Control/ControlCard';

const ControlScreen = () => {
  const { auth } = useAuthContext();

  const [menu, setMenu] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getMenuRequest();
  }, []);

  const getMenuRequest = async () => {
    if (auth.type !== 'authorized') {
      return;
    }

    try {
      setIsLoading(true);
      const data = await getMenu({ token: auth.token });
      setMenu(data);
    } finally {
      setIsLoading(false);
    }
  };

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
    return false;
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
