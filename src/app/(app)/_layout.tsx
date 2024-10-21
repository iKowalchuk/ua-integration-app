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
          title: i18n.t('screen.camera_screen'),
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: i18n.t('screen.login_screen'),
        }}
      />
      <Stack.Screen
        name="account"
        options={{
          title: i18n.t('screen.account_screen'),
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: i18n.t('screen.settings_screen'),
        }}
      />
      <Stack.Screen
        name="guest-car-add"
        options={{
          title: i18n.t('screen.guest_car_add_screen'),
        }}
      />
      <Stack.Screen
        name="guest-car-edit"
        options={{
          title: i18n.t('screen.guest_car_edit_screen'),
        }}
      />
      <Stack.Screen
        name="guest-cars"
        options={{
          title: i18n.t('screen.guest_cars_screen'),
        }}
      />
      <Stack.Screen
        name="my-car-add"
        options={{
          title: i18n.t('screen.my_car_add_screen'),
        }}
      />
      <Stack.Screen
        name="my-car-edit"
        options={{
          title: i18n.t('screen.my_car_edit_screen'),
        }}
      />
      <Stack.Screen
        name="my-cars"
        options={{
          title: i18n.t('screen.my_cars_screen'),
        }}
      />
      <Stack.Screen
        name="publications"
        options={{
          title: i18n.t('screen.publications_screen'),
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: i18n.t('screen.notifications_screen'),
        }}
      />
    </Stack>
  );
};

export default OperatorLayout;
