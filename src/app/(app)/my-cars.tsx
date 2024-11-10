import {
  Button,
  ButtonIcon,
  Center,
  HStack,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { Link, Stack } from 'expo-router';
import i18n from 'i18n-js';
import { EditIcon } from 'lucide-react-native';
import React from 'react';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMyCars, useRefreshByUser } from '@/api';
import Card from '@/components/Card';
import LoadingView from '@/components/LoadingView';
import { useAuthContext } from '@/contexts/AuthContext';

const MyCars = () => {
  const insets = useSafeAreaInsets();
  const { authState } = useAuthContext();

  const { data, isPending, isError, refetch } = useMyCars({
    variables: {
      // @ts-ignore
      token: authState.session.token,
      // @ts-ignore
      apiURL: authState.session.apiURL,
    },
  });

  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Link href="/my-car-add" asChild>
              <TouchableOpacity>
                <Text color="$blue500">{i18n.t('button.add')}</Text>
              </TouchableOpacity>
            </Link>
          ),
        }}
      />

      <FlatList
        style={{ paddingHorizontal: 16 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingVertical: 16,
          paddingBottom: 16 + insets.bottom,
          gap: 8,
        }}
        data={data}
        renderItem={({ item }) => (
          <Card>
            <VStack p="$4" space="md">
              <HStack
                space="md"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text size="md" fontWeight="$bold" numberOfLines={1}>
                  {item.carNumber}
                </Text>
                <Link
                  href={{
                    pathname: '/my-car-edit',
                    params: { id: item.id },
                  }}
                  asChild
                >
                  <Button size="xs" variant="link">
                    <ButtonIcon as={EditIcon} size="md" />
                  </Button>
                </Link>
              </HStack>
            </VStack>
          </Card>
        )}
        keyExtractor={(item) => `item-${item.id}`}
        ListEmptyComponent={() => {
          if (isPending) {
            return <LoadingView />;
          }

          if (isError) {
            return (
              <Center flex={1}>
                <Text>{i18n.t('error_loading_data')}</Text>
              </Center>
            );
          }

          return (
            <Center flex={1}>
              <Text>{i18n.t('no_data_found')}</Text>
            </Center>
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetchingByUser}
            onRefresh={refetchByUser}
          />
        }
      />
    </>
  );
};

export default MyCars;
