import {
  Avatar,
  AvatarFallbackText,
  Box,
  Button,
  ButtonSpinner,
  ButtonText,
  Center,
  Heading,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { nativeApplicationVersion } from 'expo-application';
import i18n from 'i18n-js';
import React, { useEffect, useState } from 'react';

import getUser, { type User } from '@/api/getUser';
import LoadingView from '@/components/LoadingView';
import { useAuthContext } from '@/contexts/AuthContext';

const Account = () => {
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
          apiURL: authState.session.apiURL,
          token: authState.session.token,
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
    return <LoadingView />;
  }

  return (
    <Box flex={1} padding="$4">
      <Center flex={1}>
        <Avatar bg="$green500" size="xl">
          <AvatarFallbackText>{user?.name}</AvatarFallbackText>
        </Avatar>
        <Center mt="$2">
          <Heading size="lg">{user?.name || '-'}</Heading>
          <Text size="sm">{user?.houseName || '-'}</Text>
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

export default Account;
