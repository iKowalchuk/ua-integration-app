import { Redirect, Stack } from 'expo-router';
import i18n from 'i18n-js';
import React from 'react';

import LoadingView from '@/components/LoadingView';
import { useAuthContext } from '@/contexts/AuthContext';

const OperatorLayout = () => {
  const { authState } = useAuthContext();

  if (authState.type === 'initial') {
    return <LoadingView />;
  }

  if (authState.type === 'authenticated') {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen name="projects" options={{ headerShown: false }} />
      <Stack.Screen
        name="login"
        options={{
          title: i18n.t('screen.login_screen'),
        }}
      />
    </Stack>
  );
};

export default OperatorLayout;
