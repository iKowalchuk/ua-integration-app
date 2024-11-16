import { Box, Button, ButtonSpinner, ButtonText } from '@gluestack-ui/themed';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import i18n from 'i18n-js';
import React from 'react';
import { showMessage } from 'react-native-flash-message';

import { queryClient, useEditMyCar, useMyCars } from '@/api';
import MyCarForm, { type FormType } from '@/components/MyCarForm';
import { showErrorMessage } from '@/components/ui';
import { useAuthContext } from '@/contexts/AuthContext';

const MyCarEdit = () => {
  const navigation = useNavigation();

  const { id: carId } = useLocalSearchParams<{
    id: string;
  }>();

  const { authState } = useAuthContext();

  const { data: myCars } = useMyCars({
    variables: {
      // @ts-ignore
      token: authState.session.token,
      // @ts-ignore
      apiURL: authState.session.apiURL,
    },
  });
  const { mutate: editMyCar, isPending: isEditingMyCar } = useEditMyCar();

  const myCar = myCars?.find((car) => car.id === carId);

  const handleSubmit = (data: FormType) => {
    const existingCar = myCars?.find(
      (car) =>
        car.carNumber.toLowerCase() === data.carNumber.toLowerCase() &&
        car.id !== carId,
    );

    if (existingCar) {
      showErrorMessage(i18n.t('toast.car_number_exists'));
      return;
    }

    editMyCar(
      {
        // @ts-ignore
        token: authState.session.token,
        // @ts-ignore
        apiURL: authState.session.apiURL,
        payload: {
          carId,
          carNumber: data.carNumber,
          description: data.description,
        },
      },
      {
        onSuccess: () => {
          showMessage({
            message: i18n.t('toast.car_edited_successfully'),
            type: 'success',
          });

          navigation.goBack();
          queryClient.invalidateQueries({
            queryKey: useMyCars.getKey({
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
      <MyCarForm
        initialValues={
          myCar
            ? {
                carNumber: myCar.carNumber,
                description: myCar.description,
              }
            : undefined
        }
        onSubmit={handleSubmit}
        renderButton={({ onPress }) => (
          <Button onPress={onPress} isDisabled={isEditingMyCar}>
            {isEditingMyCar && <ButtonSpinner mr="$1" />}
            <ButtonText>{i18n.t('button.save')}</ButtonText>
          </Button>
        )}
      />
    </Box>
  );
};

export default MyCarEdit;
