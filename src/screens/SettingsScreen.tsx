import {
  Avatar,
  AvatarFallbackText,
  Center,
  Button,
  ButtonSpinner,
  ButtonText,
  Heading,
  Text,
  Box,
  VStack,
} from '@gluestack-ui/themed';
import { nativeApplicationVersion } from 'expo-application';
import i18n from 'i18n-js';
import React, { useEffect, useState } from 'react';

import getUser, { User } from '@/api/getUser';
import logout from '@/api/logout';
import { useAuthContext } from '@/hooks/useAuth';
import { useProjectsContext } from '@/hooks/useProjects';

const SettingsScreen = () => {
  const { removeProject } = useProjectsContext();
  const { auth, removeAuth } = useAuthContext();

  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLogout, setIsLogout] = useState<boolean>(false);

  useEffect(() => {
    getUserRequest();
  }, []);

  const getUserRequest = async () => {
    if (auth.type !== 'authorized') {
      return;
    }

    try {
      setIsLoading(true);
      const data = await getUser({ token: auth.token });
      setUser(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (auth.type !== 'authorized') {
      return;
    }

    try {
      setIsLogout(true);

      await logout({ token: auth.token });

      await removeProject();
      await removeAuth();
    } finally {
      setIsLogout(false);
    }
  };

  if (isLoading) {
    return false;
  }

  return (
    <Box flex={1} padding="$4">
      <Center flex={1}>
        <Avatar bg="$green500" size="xl">
          <AvatarFallbackText>{user?.descr}</AvatarFallbackText>
        </Avatar>
        <Center mt="$2">
          <Heading size="lg">{user?.descr || '-'}</Heading>
          <Text fontSize="$sm">{user?.nameHouse || '-'}</Text>
        </Center>
      </Center>
      <VStack space="md">
        <Button
          mt="$4"
          size="md"
          variant="outline"
          action="negative"
          onPress={handleLogout}
          isDisabled={isLogout}
        >
          {isLogout && <ButtonSpinner mr="$1" />}
          <ButtonText>{i18n.t('settings.logout_button')}</ButtonText>
        </Button>
        <Text fontSize="$xs" textAlign="center">
          v{nativeApplicationVersion}
        </Text>
      </VStack>
    </Box>
  );
};

export default SettingsScreen;
