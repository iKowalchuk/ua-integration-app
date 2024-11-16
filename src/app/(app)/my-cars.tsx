import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Button,
  ButtonIcon,
  ButtonText,
  Center,
  HStack,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { ButtonSpinner } from '@gluestack-ui/themed';
import { Link, Stack } from 'expo-router';
import i18n from 'i18n-js';
import { EditIcon, TrashIcon } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { type MyCar, queryClient, useMyCars, useRefreshByUser } from '@/api';
import { useDeleteMyCar } from '@/api/myCars/useDeleteMyCar';
import Card from '@/components/Card';
import LoadingView from '@/components/LoadingView';
import { showErrorMessage } from '@/components/ui';
import { useAuthContext } from '@/contexts/AuthContext';

const MyCars = () => {
  const insets = useSafeAreaInsets();

  const { authState } = useAuthContext();

  const {
    data: myCars,
    isPending: isPendingMyCars,
    isError: isErrorMyCars,
    refetch: refetchMyCars,
  } = useMyCars({
    variables: {
      // @ts-ignore
      token: authState.session.token,
      // @ts-ignore
      apiURL: authState.session.apiURL,
    },
  });
  const { mutate: deleteMyCar, isPending: isDeletingMyCar } = useDeleteMyCar();

  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetchMyCars);

  const [carToDelete, setCarToDelete] = useState<MyCar | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteCar = (car: MyCar) => {
    setCarToDelete(car);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (!carToDelete) return;

    deleteMyCar(
      {
        // @ts-ignore
        token: authState.session.token,
        // @ts-ignore
        apiURL: authState.session.apiURL,
        payload: { carId: carToDelete.id, carNumber: carToDelete.carNumber },
      },
      {
        onSuccess: () => {
          showMessage({
            message: i18n.t('toast.car_deleted'),
            type: 'success',
          });

          queryClient.invalidateQueries({
            queryKey: useMyCars.getKey({
              // @ts-ignore
              token: authState.session.token,
              // @ts-ignore
              apiURL: authState.session.apiURL,
            }),
          });
          setShowDeleteDialog(false);
        },
        onError: () => {
          showErrorMessage(i18n.t('toast.error_deleting_car'));
          setShowDeleteDialog(false);
        },
      },
    );
  };

  const canAddMoreCars = !myCars || myCars.length < 5;

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () =>
            canAddMoreCars ? (
              <Link href="/my-car-add" asChild>
                <TouchableOpacity>
                  <Text color="$blue500">{i18n.t('button.add')}</Text>
                </TouchableOpacity>
              </Link>
            ) : null,
        }}
      />

      <AlertDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
        }}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Text size="lg" fontWeight="$bold">
              {i18n.t('dialog.delete_car.title')}
            </Text>
            <AlertDialogCloseButton />
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text size="sm">
              {i18n.t('dialog.delete_car.message', {
                carNumber: carToDelete?.carNumber,
              })}
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              variant="outline"
              action="secondary"
              mr="$3"
              onPress={() => {
                setShowDeleteDialog(false);
              }}
            >
              <ButtonText>{i18n.t('button.cancel')}</ButtonText>
            </Button>
            <Button
              action="negative"
              onPress={confirmDelete}
              isDisabled={isDeletingMyCar}
            >
              {isDeletingMyCar && <ButtonSpinner mr="$1" />}
              <ButtonText>{i18n.t('button.delete')}</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <FlatList
        style={{ paddingHorizontal: 16 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingVertical: 16,
          paddingBottom: 16 + insets.bottom,
          gap: 8,
        }}
        data={myCars}
        renderItem={({ item }) => (
          <Card>
            <VStack p="$4" space="xs">
              <HStack
                space="md"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text size="md" fontWeight="$bold" numberOfLines={1}>
                  {item.carNumber}
                </Text>
                <HStack space="2xl">
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
                  <Button
                    size="xs"
                    variant="link"
                    action="negative"
                    onPress={() => {
                      handleDeleteCar(item);
                    }}
                  >
                    <ButtonIcon as={TrashIcon} size="md" />
                  </Button>
                </HStack>
              </HStack>
              <Text size="sm" numberOfLines={3}>
                {item.description}
              </Text>
            </VStack>
          </Card>
        )}
        keyExtractor={(item) => `item-${item.id}`}
        ListEmptyComponent={() => {
          if (isPendingMyCars) {
            return <LoadingView />;
          }

          if (isErrorMyCars) {
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
