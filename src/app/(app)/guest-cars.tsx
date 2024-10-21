import {
  Box,
  Button,
  ButtonIcon,
  Center,
  HStack,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { isBefore } from 'date-fns';
import { Link, Stack } from 'expo-router';
import i18n from 'i18n-js';
import { EditIcon } from 'lucide-react-native';
import React from 'react';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';

import { useGuestCars, useRefreshByUser, useRefreshOnFocus } from '@/api';
import Card from '@/components/Card';
import LoadingView from '@/components/LoadingView';
import { useAuthContext } from '@/contexts/AuthContext';
import { formatDate } from '@/utils/formatDate';

const GuestCars = () => {
  const { authState } = useAuthContext();

  const { data, isPending, isError, refetch } = useGuestCars({
    variables: {
      // @ts-ignore
      token: authState.session.token,
      // @ts-ignore
      apiURL: authState.session.apiURL,
    },
  });

  useRefreshOnFocus(refetch);
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Link href="/guest-car-add" asChild>
              <TouchableOpacity>
                <Text color="$blue500">{i18n.t('button.add')}</Text>
              </TouchableOpacity>
            </Link>
          ),
        }}
      />

      <FlatList
        style={{ paddingHorizontal: 16 }}
        contentContainerStyle={{ flex: 1, paddingVertical: 16, gap: 8 }}
        data={data}
        renderItem={({ item }) => {
          const isActualDate = isBefore(new Date(), new Date(item.actualDate));
          const formattedActualDate = formatDate(
            item.actualDate,
            'dd.MM.yyyy HH:mm',
          );

          return (
            <Card>
              <VStack p="$4" space="md">
                <VStack>
                  <HStack space="md" justifyContent="space-between">
                    <Box h="$6">
                      {isActualDate ? (
                        <Text color="$green500" size="sm">
                          {formattedActualDate}
                        </Text>
                      ) : (
                        <Text color="$red500" size="sm">
                          {formattedActualDate}
                        </Text>
                      )}
                    </Box>

                    <HStack space="3xl">
                      <Link
                        href={{
                          pathname: '/guest-car-edit',
                          params: { id: item.id },
                        }}
                        asChild
                      >
                        <Button size="xs" variant="link">
                          <ButtonIcon as={EditIcon} size="md" />
                        </Button>
                      </Link>
                    </HStack>
                  </HStack>
                  <Text size="md" fontWeight="$bold" numberOfLines={1}>
                    {item.carNumber}
                  </Text>
                </VStack>
              </VStack>
            </Card>
          );
        }}
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

export default GuestCars;
