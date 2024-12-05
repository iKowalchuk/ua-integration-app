import { Textarea } from '@gluestack-ui/themed';
import { TextareaInput } from '@gluestack-ui/themed';
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

const CAR_NUMBER_MIN = 6;
const CAR_NUMBER_MAX = 8;

const DESCRIPTION_MIN = 1;
const DESCRIPTION_MAX = 100;

const schema = z.object({
  carNumber: z
    .string({
      required_error: 'car_number_is_required_error',
      invalid_type_error: 'car_number_invalid_error',
    })
    .min(CAR_NUMBER_MIN, { message: 'car_number_min_error' })
    .max(CAR_NUMBER_MAX, { message: 'car_number_max_error' }),
  description: z
    .string({
      required_error: 'description_is_required_error',
      invalid_type_error: 'description_invalid_error',
    })
    .min(DESCRIPTION_MIN, { message: 'description_min_error' })
    .max(DESCRIPTION_MAX, { message: 'description_max_error' }),
});

export type FormType = z.infer<typeof schema>;

type MyCarFormProps = {
  initialValues?: FormType;
  onSubmit: SubmitHandler<FormType>;
  renderButton: (props: { onPress: () => void }) => ReactNode;
};

const MyCarForm = ({
  initialValues,
  onSubmit,
  renderButton,
}: MyCarFormProps) => {
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
      <FormControl
        size="md"
        isInvalid={!!errors.carNumber}
        isRequired={true}
        isDisabled={initialValues !== undefined}
      >
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
            {i18n.t('error.' + errors?.carNumber?.message, {
              min: CAR_NUMBER_MIN,
              max: CAR_NUMBER_MAX,
            })}
          </FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl size="md" isInvalid={!!errors.description} isRequired={true}>
        <FormControlLabel mb="$1">
          <FormControlLabelText>
            {i18n.t('label.description')}
          </FormControlLabelText>
        </FormControlLabel>
        <Controller
          name="description"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Textarea>
              <TextareaInput
                type="text"
                defaultValue={value}
                onChangeText={onChange}
                onBlur={onBlur}
                returnKeyType="done"
              />
            </Textarea>
          )}
        />
        <FormControlError>
          <FormControlErrorText>
            {i18n.t('error.' + errors?.description?.message, {
              min: DESCRIPTION_MIN,
              max: DESCRIPTION_MAX,
            })}
          </FormControlErrorText>
        </FormControlError>
      </FormControl>

      {renderButton({ onPress: handleSubmit(onSubmit) })}
    </VStack>
  );
};

export default MyCarForm;
