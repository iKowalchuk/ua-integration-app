import Ionicons from '@expo/vector-icons/Ionicons';
import { Button, ButtonIcon, HStack } from '@gluestack-ui/themed';
import { Tabs, useRouter } from 'expo-router';
import i18n from 'i18n-js';
import { CircleUserRoundIcon, SettingsIcon } from 'lucide-react-native';
import React from 'react';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/Colors';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
const TabBarIcon = (props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) => {
  return <Ionicons size={28} style={{ marginBottom: -6 }} {...props} />;
};

const TabLayout = () => {
  const router = useRouter();

  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: i18n.t('common.controls_screen'),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="key-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: i18n.t('common.projects_screen'),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="business-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: i18n.t('common.menu_screen'),
          tabBarIcon: ({ color }) => <TabBarIcon name="menu" color={color} />,
          headerRight: () => (
            <HStack space="2xl" pr={16}>
              <Button
                size="xs"
                variant="link"
                action="secondary"
                onPress={() => {
                  router.push('/account');
                }}
              >
                <ButtonIcon as={CircleUserRoundIcon} size="xl" />
              </Button>
              <Button
                size="xs"
                variant="link"
                action="secondary"
                onPress={() => {
                  router.push('/settings');
                }}
              >
                <ButtonIcon as={SettingsIcon} size="xl" />
              </Button>
            </HStack>
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
