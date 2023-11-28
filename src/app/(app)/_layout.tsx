import { Redirect, Stack, useGlobalSearchParams } from 'expo-router';
import i18n from 'i18n-js';
import React from 'react';

import { useAuthContext } from '@/contexts/AuthContext';
import LoadingScreen from '@/screens/LoadingScreen';

const OperatorLayout = () => {
  const { project } = useGlobalSearchParams<{ project?: string }>();

  const { authState } = useAuthContext();

  if (authState.type === 'initial') {
    return <LoadingScreen />;
  }

  if (authState.type === 'unauthenticated') {
    return <Redirect href="/(auth)/projects" />;
  }

  const projectObject = project && JSON.parse(project);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="login"
        options={{
          title: projectObject?.descr ?? i18n.t('common.login_screen'),
        }}
      />
    </Stack>
  );
};

export default OperatorLayout;
