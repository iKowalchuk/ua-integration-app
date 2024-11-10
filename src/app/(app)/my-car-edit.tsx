import { Box, Button, ButtonSpinner, ButtonText } from '@gluestack-ui/themed';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import i18n from 'i18n-js';
import React from 'react';
import { showMessage } from 'react-native-flash-message';

import { queryClient, useEditMyCar, useMyCars } from '@/api';
import MyCarForm, { type FormType } from '@/components/MyCarForm';
import { useAuthContext } from '@/contexts/AuthContext';
import { showErrorMessage } from '@/ui';

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
  const { mutate: editMyCar, isPending } = useEditMyCar();

  const myCar = myCars?.find((item) => item.id === carId);

  const handleSubmit = (data: FormType) => {
    editMyCar(
      {
        // @ts-ignore
        token: authState.session.token,
        // @ts-ignore
        apiURL: authState.session.apiURL,
        payload: { carId, carNumber: data.carNumber },
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

export default MyCarEdit;
