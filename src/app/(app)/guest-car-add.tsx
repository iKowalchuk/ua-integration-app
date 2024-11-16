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

  const { mutate: addGuestCar, isPending } = useAddGuestCar();

  const handleSubmit = (data: FormType) => {
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
        onError: () => {
          showErrorMessage(i18n.t('toast.error_adding_car'));
        },
      },
    );
  };

  return (
    <Box flex={1} padding="$4">
      <GuestCarForm
        onSubmit={handleSubmit}
        renderButton={({ onPress }) => (
          <Button onPress={onPress} isDisabled={isPending}>
            {isPending && <ButtonSpinner mr="$1" />}
            <ButtonText>{i18n.t('button.add')}</ButtonText>
          </Button>
        )}
      />
    </Box>
  );
};

export default GuestCarAdd;
