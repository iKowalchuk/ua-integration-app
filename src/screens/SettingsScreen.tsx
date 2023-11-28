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
import { useAuthContext } from '@/contexts/AuthContext';

const SettingsScreen = () => {
  const { authState, onLogout } = useAuthContext();

  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLogout, setIsLogout] = useState<boolean>(false);

  useEffect(() => {
    const getUserRequest = async () => {
      if (authState.type !== 'authenticated') {
        return;
      }

      try {
        setIsLoading(true);
        const data = await getUser({
          apiURL: authState.apiURL,
          token: authState.token,
        });
        setUser(data);
      } finally {
        setIsLoading(false);
      }
    };

    getUserRequest();
  }, [authState]);

  const handleLogout = async () => {
    try {
      setIsLogout(true);

      await onLogout();
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
          <Text size="sm">{user?.nameHouse || '-'}</Text>
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
        <Text size="xs" textAlign="center">
          v{nativeApplicationVersion}
        </Text>
      </VStack>
    </Box>
  );
};

export default SettingsScreen;
