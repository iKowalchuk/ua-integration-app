import {
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  Center,
  Divider,
  HStack,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { differenceInMinutes } from 'date-fns';
import { Link, Stack } from 'expo-router';
import i18n from 'i18n-js';
import { EditIcon } from 'lucide-react-native';
import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useGuestCars, useRefreshByUser, useRefreshOnFocus } from '@/api';
import Card from '@/components/Card';
import LoadingView from '@/components/LoadingView';
import { useAuthContext } from '@/contexts/AuthContext';
import { getCurrentKyivTime } from '@/utils/dateTime';
import { formatDate } from '@/utils/formatDate';

// Time in minutes during which the record can be edited
const EDIT_TIME_MINUTES = 30;

const GuestCars = () => {
  const insets = useSafeAreaInsets();

  const { authState } = useAuthContext();

  const {
    data: guestCars,
    isPending: isPendingGuestCars,
    isError: isErrorGuestCars,
    refetch: refetchGuestCars,
  } = useGuestCars({
    variables: {
      // @ts-ignore
      token: authState.session.token,
      // @ts-ignore
      apiURL: authState.session.apiURL,
    },
  });

  useRefreshOnFocus(refetchGuestCars);
  const { isRefetchingByUser, refetchByUser } =
    useRefreshByUser(refetchGuestCars);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Link href="/guest-car-add" asChild>
              <Button variant="link" action="secondary">
                <ButtonText color="$blue500">{i18n.t('button.add')}</ButtonText>
              </Button>
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
        data={guestCars}
        renderItem={({ item }) => {
          const formattedActualDate = formatDate(
            item.actualTo,
            'dd.MM.yyyy HH:mm',
          );

          const currentKyivTime = getCurrentKyivTime();
          const createdAtDate = new Date(item.createdAt);
          const diffInMinutes = differenceInMinutes(
            currentKyivTime,
            createdAtDate,
          );

          const canEdit =
            item.status === 'active' && diffInMinutes <= EDIT_TIME_MINUTES;

          return (
            <Card>
              <VStack p="$4" space="md">
                <VStack>
                  <HStack space="md" justifyContent="space-between" h={32}>
                    <Box h="$6">
                      {item.status === 'active' ? (
                        <HStack space="xs" alignItems="center">
                          <Text color="$green500" size="sm">
                            {i18n.t('status.active')}
                          </Text>
                          <Divider h={2.5} w={2.5} />
                          <Text size="sm" opacity={0.8}>
                            {formattedActualDate}
                          </Text>
                        </HStack>
                      ) : (
                        <HStack space="xs" alignItems="center">
                          <Text color="$red500" size="sm">
                            {i18n.t('status.completed')}
                          </Text>
                          <Divider h={2.5} w={2.5} />
                          <Text size="sm" opacity={0.8}>
                            {formattedActualDate}
                          </Text>
                        </HStack>
                      )}
                    </Box>

                    <HStack space="2xl">
                      {canEdit ? (
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
                      ) : null}
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
          if (isPendingGuestCars) {
            return <LoadingView />;
          }

          if (isErrorGuestCars) {
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
