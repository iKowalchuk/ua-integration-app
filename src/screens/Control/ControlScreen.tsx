import { Center, Heading } from '@gluestack-ui/themed';
import React, { useEffect, useMemo, useState } from 'react';
import { SectionList } from 'react-native';

import getMenu, { Menu } from '@/api/getMenu';
import runCommand from '@/api/runCommand';
import { useAuthContext } from '@/hooks/useAuth';
import ControlItem from '@/screens/Control/ControlItem';

const ControlScreen = () => {
  const { auth } = useAuthContext();

  const [menu, setMenu] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRunCommand, setIsRunCommand] = useState<{ [key: string]: boolean }>(
    {}
  );

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

  const handleClick = async (command: string) => {
    if (auth.type !== 'authorized') {
      return;
    }

    try {
      setIsRunCommand((state) => ({ ...state, [command]: true }));
      await runCommand({ token: auth.token, command });
    } finally {
      setIsRunCommand((state) => ({ ...state, [command]: false }));
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
    <SectionList
      contentContainerStyle={{
        gap: 16,
        padding: 16,
      }}
      sections={sectionMenu}
      renderItem={({ item }) => (
        <ControlItem
          label={item.descr}
          status="online"
          onOpenPress={() => handleClick(item.pCmdIn)}
          onVideoPress={() => {}}
          onMorePress={() => {}}
          isDisabled={isRunCommand[item.pCmdIn]}
          isRunCommand={isRunCommand[item.pCmdIn]}
        />
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
