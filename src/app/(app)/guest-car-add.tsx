import { Box, Button, ButtonSpinner, ButtonText } from '@gluestack-ui/themed';
import { useNavigation } from 'expo-router';
import i18n from 'i18n-js';
import React from 'react';
import { showMessage } from 'react-native-flash-message';

import { queryClient, useAddGuestCar, useGuestCars } from '@/api';
import GuestCarForm, { type FormType } from '@/components/GuestCarForm';
import { showErrorMessage } from '@/components/ui';
import { useAuthContext } from '@/contexts/AuthContext';

const GuestCarAdd = () => {
  const navigation = useNavigation();

  const { authState } = useAuthContext();

  const { data: guestCars } = useGuestCars({
    variables: {
      // @ts-ignore
      token: authState.session.token,
      // @ts-ignore
      apiURL: authState.session.apiURL,
    },
  });
  const { mutate: addGuestCar, isPending: isAddingGuestCar } = useAddGuestCar();

  const handleSubmit = (data: FormType) => {
    const existingCar = guestCars?.find(
      (car) => car.carNumber.toLowerCase() === data.carNumber.toLowerCase(),
    );

    if (existingCar) {
      showErrorMessage(i18n.t('toast.car_number_exists'));
      return;
    }

    addGuestCar(
      {
        // @ts-ignore
        token: authState.session.token,
        // @ts-ignore
        apiURL: authState.session.apiURL,
        payload: { carNumber: data.carNumber, hours: data.hours },
      },
      {
        onSuccess: () => {
          showMessage({
            message: i18n.t('toast.car_added_successfully'),
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
        onError: (error: any) => {
          if (error.message === 'car_number_exists') {
            showErrorMessage(i18n.t('toast.car_number_exists'));
          } else {
            showErrorMessage(i18n.t('toast.error_adding_car'));
          }
        },
      },
    );
  };

  return (
    <Box flex={1} padding="$4">
      <GuestCarForm
        onSubmit={handleSubmit}
        renderButton={({ onPress }) => (
          <Button onPress={onPress} isDisabled={isAddingGuestCar}>
            {isAddingGuestCar && <ButtonSpinner mr="$1" />}
            <ButtonText>{i18n.t('button.add')}</ButtonText>
          </Button>
        )}
      />
    </Box>
  );
};

export default GuestCarAdd;
