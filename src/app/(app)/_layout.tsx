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

  if (authState.type === 'unauthenticated') {
    return <Redirect href="/(auth)/projects" />;
  }

  return (
    <Stack screenOptions={{ headerBackTitleVisible: false }}>
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
          title: i18n.t('common.login_screen'),
        }}
      />
      <Stack.Screen
        name="account"
        options={{
          title: i18n.t('common.account_screen'),
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: i18n.t('common.settings_screen'),
        }}
      />
      <Stack.Screen
        name="guest-cars"
        options={{
          title: i18n.t('common.guest_cars_screen'),
        }}
      />
      <Stack.Screen
        name="my-cars"
        options={{
          title: i18n.t('common.my_cars_screen'),
        }}
      />
      <Stack.Screen
        name="publications"
        options={{
          title: i18n.t('common.publications_screen'),
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: i18n.t('common.notifications_screen'),
        }}
      />
    </Stack>
  );
};

export default OperatorLayout;
