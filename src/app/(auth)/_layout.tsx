import { Redirect, Stack, useGlobalSearchParams } from 'expo-router';
import i18n from 'i18n-js';
import React from 'react';

import { useAuthContext } from '@/hooks/useAuth';
import LoadingScreen from '@/screens/LoadingScreen';

const OperatorLayout = () => {
  const { project } = useGlobalSearchParams<{ project?: string }>();

  const { auth } = useAuthContext();

  if (auth.type === 'initial') {
    return <LoadingScreen />;
  }

  if (auth.type === 'authorized') {
    return <Redirect href="/(app)/(tabs)" />;
  }

  const projectObject = project && JSON.parse(project);

  return (
    <Stack>
      <Stack.Screen name="projects" options={{ headerShown: false }} />
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
