import { Redirect, Stack, useGlobalSearchParams } from 'expo-router';
import i18n from 'i18n-js';
import React from 'react';

import LoadingView from '@/components/LoadingView';
import { useAuthContext } from '@/contexts/AuthContext';

const OperatorLayout = () => {
  const { project } = useGlobalSearchParams<{ project?: string }>();

  const { authState } = useAuthContext();

  if (authState.type === 'initial') {
    return <LoadingView />;
  }

  if (authState.type === 'unauthenticated') {
    return <Redirect href="/(auth)/projects" />;
  }

  const projectObject = project && JSON.parse(project);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="camera"
        options={{
          title: i18n.t('common.camera_screen'),
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: projectObject?.name ?? i18n.t('common.login_screen'),
        }}
      />
    </Stack>
  );
};

export default OperatorLayout;
