import {
  Center,
  Box,
  Button,
  ButtonSpinner,
  ButtonText,
  Heading,
  VStack,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  FormControlError,
  FormControlErrorText,
  Toast,
  ToastTitle,
  useToast,
} from '@gluestack-ui/themed';
import { useRouter } from 'expo-router';
import i18n from 'i18n-js';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

import { Project } from '@/api/getProjects';
import { useAuthContext } from '@/contexts/AuthContext';

type LoginScreenProps = {
  project: Project;
};

const LoginScreen = ({ project }: LoginScreenProps) => {
  const router = useRouter();

  const toast = useToast();

  const { onLogin } = useAuthContext();

  const [formData, setFormData] = useState<{ login: string; password: string }>(
    {
      login: '',
      password: '',
    }
  );
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setIsSubmit(true);

    if (!formData.login && !formData.password) {
      return;
    }

    try {
      setIsLoading(true);

      await onLogin({
        apiURL: project.urlSite,
        projectId: project.id,
        login: formData.login,
        password: formData.password,
      });

      router.replace('/');
    } catch {
      toast.show({
        placement: 'top',
        render: () => {
          return (
            <Toast action="error">
              <ToastTitle>
                {i18n.t('login.incorrect_login_or_password_error')}
              </ToastTitle>
            </Toast>
          );
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Center flex={1}>
        <Box p="$2" w="90%">
          <Heading size="lg" color="$primary500">
            {i18n.t('login.welcome_title')}
          </Heading>
          <Heading color="$secondary400" size="xs">
            {i18n.t('login.sign_in_to_continue_subtitle')}
          </Heading>
          <VStack space="md" mt="$5">
            <FormControl size="md" isInvalid={isSubmit && !formData.login}>
              <FormControlLabel mb="$1">
                <FormControlLabelText>
                  {i18n.t('login.login_label')}
                </FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  value={formData.login}
                  onChangeText={(value) =>
                    setFormData({ ...formData, login: value })
                  }
                  placeholderTextColor="#FFFFFF"
                />
              </Input>
              <FormControlError>
                <FormControlErrorText>
                  {i18n.t('login.login_is_required_error')}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            <FormControl size="md" isInvalid={isSubmit && !formData.password}>
              <FormControlLabel mb="$1">
                <FormControlLabelText>
                  {i18n.t('login.password_label')}
                </FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  type="password"
                  value={formData.password}
                  onChangeText={(value) =>
                    setFormData({ ...formData, password: value })
                  }
                  placeholderTextColor="#FFFFFF"
                />
              </Input>
              <FormControlError>
                <FormControlErrorText>
                  {i18n.t('login.password_is_required_error')}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            <Button mt="$5" onPress={handleLogin} isDisabled={isLoading}>
              {isLoading && <ButtonSpinner mr="$1" />}
              <ButtonText>{i18n.t('login.login_button')}</ButtonText>
            </Button>
          </VStack>
        </Box>
      </Center>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
