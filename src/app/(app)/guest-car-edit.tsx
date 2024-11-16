import { Box, Button, ButtonSpinner, ButtonText } from '@gluestack-ui/themed';
import { differenceInMinutes } from 'date-fns';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import i18n from 'i18n-js';
import React from 'react';
import { showMessage } from 'react-native-flash-message';

import { queryClient, useEditGuestCar, useGuestCars } from '@/api';
import GuestCarForm, { type FormType } from '@/components/GuestCarForm';
import { showErrorMessage } from '@/components/ui';
import { useAuthContext } from '@/contexts/AuthContext';

const GuestCarEdit = () => {
  const navigation = useNavigation();

  const { id: carId } = useLocalSearchParams<{
    id: string;
  }>();

  const { authState } = useAuthContext();

  const { data: guestCars } = useGuestCars({
    variables: {
      // @ts-ignore
      token: authState.session.token,
      // @ts-ignore
      apiURL: authState.session.apiURL,
    },
  });
  const { mutate: editGuestCar, isPending } = useEditGuestCar();

  const guestCar = guestCars?.find((item) => item.id === carId);

  const handleSubmit = (data: FormType) => {
    editGuestCar(
      {
        // @ts-ignore
        token: authState.session.token,
        // @ts-ignore
        apiURL: authState.session.apiURL,
        payload: { carId, carNumber: data.carNumber, hours: data.hours },
      },
      {
        onSuccess: () => {
          showMessage({
            message: i18n.t('toast.car_edited_successfully'),
            type: 'success',
          });

          navigation.goBack();
          queryClient.invalidateQueries({
            queryKey: useGuestCars.getKey({
              // @ts-ignore
              token: authState.session.token,
              // @ts-ignore
              apiURL: authState.session.apiURL,
            }),
          });
        },
        onError: () => {
          showErrorMessage(i18n.t('toast.error_editing_car'));
        },
      },
    );
  };

  return (
    <Box flex={1} padding="$4">
      <GuestCarForm
        initialValues={
          guestCar
            ? {
                carNumber: guestCar.carNumber,
                hours: Math.max(
                  Number(
                    (
                      differenceInMinutes(
                        new Date(guestCar.actualTo),
                        new Date(),
                      ) / 60
                    ).toFixed(2),
                  ),
                  0,
                ),
              }
            : undefined
        }
        onSubmit={handleSubmit}
        renderButton={({ onPress }) => (
          <Button onPress={onPress} isDisabled={isPending}>
            {isPending && <ButtonSpinner mr="$1" />}
            <ButtonText>{i18n.t('button.save')}</ButtonText>
          </Button>
        )}
      />
    </Box>
  );
};

export default GuestCarEdit;
