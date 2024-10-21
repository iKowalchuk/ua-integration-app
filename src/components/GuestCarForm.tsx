import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  VStack,
} from '@gluestack-ui/themed';
import { zodResolver } from '@hookform/resolvers/zod';
import i18n from 'i18n-js';
import React, { type ReactNode } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  carNumber: z
    .string({
      required_error: 'car_number_is_required_error',
      invalid_type_error: 'car_number_invalid_error',
    })
    .min(1, { message: 'car_number_is_required_error' }),
  hours: z
    .number({
      required_error: 'hours_is_required_error',
      invalid_type_error: 'hours_invalid_error',
    })
    .min(1, { message: 'hours_min_error' })
    .max(99, { message: 'hours_max_error' }),
});

export type FormType = z.infer<typeof schema>;

export type GuestCarFormProps = {
  initialValues?: FormType;
  onSubmit: SubmitHandler<FormType>;
  renderButton: (props: { onPress: () => void }) => ReactNode;
};

const GuestCarForm = ({
  initialValues,
  onSubmit,
  renderButton,
}: GuestCarFormProps) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormType>({
    defaultValues: initialValues,
    resolver: zodResolver(schema),
  });

  return (
    <VStack space="md">
      <FormControl size="md" isInvalid={!!errors.carNumber} isRequired={true}>
        <FormControlLabel mb="$1">
          <FormControlLabelText>
            {i18n.t('label.car_number')}
          </FormControlLabelText>
        </FormControlLabel>
        <Controller
          name="carNumber"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                type="text"
                defaultValue={value}
                onChangeText={onChange}
                onBlur={onBlur}
                returnKeyType="done"
              />
            </Input>
          )}
        />
        <FormControlError>
          <FormControlErrorText>
            {i18n.t('error.' + errors?.carNumber?.message)}
          </FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl size="md" isInvalid={!!errors.hours} isRequired={true}>
        <FormControlLabel mb="$1">
          <FormControlLabelText>{i18n.t('label.hours')}</FormControlLabelText>
        </FormControlLabel>
        <Controller
          name="hours"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                type="text"
                defaultValue={value ? `${value}` : ''}
                onChangeText={(value) => {
                  onChange(value === '' ? undefined : parseInt(value, 10));
                }}
                onBlur={onBlur}
                keyboardType="number-pad"
                returnKeyType="done"
              />
            </Input>
          )}
        />
        <FormControlError>
          <FormControlErrorText>
            {i18n.t('error.' + errors?.hours?.message)}
          </FormControlErrorText>
        </FormControlError>
      </FormControl>

      {renderButton({ onPress: handleSubmit(onSubmit) })}
    </VStack>
  );
};

export default GuestCarForm;
